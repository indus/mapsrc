var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
let emptyGeoJSON = { "type": "FeatureCollection", "features": [] };
const getGeoJSONSource = (map) => {
  if (map._GeoJSONSource) {
    return map._GeoJSONSource;
  } else {
    map.style.addSource("$geojson", {
      "type": "geojson",
      "data": emptyGeoJSON
    });
    map._GeoJSONSource = map.style.getSource("$geojson").constructor;
    map.style.removeSource("$geojson");
    return map._GeoJSONSource;
  }
};
var decode_1 = decode$1;
var keys, values, lengths, dim, e;
var geometryTypes = [
  "Point",
  "MultiPoint",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon",
  "GeometryCollection"
];
function decode$1(pbf2) {
  dim = 2;
  e = Math.pow(10, 6);
  lengths = null;
  keys = [];
  values = [];
  var obj = pbf2.readFields(readDataField, {});
  keys = null;
  return obj;
}
function readDataField(tag, obj, pbf2) {
  if (tag === 1)
    keys.push(pbf2.readString());
  else if (tag === 2)
    dim = pbf2.readVarint();
  else if (tag === 3)
    e = Math.pow(10, pbf2.readVarint());
  else if (tag === 4)
    readFeatureCollection(pbf2, obj);
  else if (tag === 5)
    readFeature(pbf2, obj);
  else if (tag === 6)
    readGeometry(pbf2, obj);
}
function readFeatureCollection(pbf2, obj) {
  obj.type = "FeatureCollection";
  obj.features = [];
  return pbf2.readMessage(readFeatureCollectionField, obj);
}
function readFeature(pbf2, feature) {
  feature.type = "Feature";
  var f = pbf2.readMessage(readFeatureField, feature);
  if (!("geometry" in f))
    f.geometry = null;
  return f;
}
function readGeometry(pbf2, geom) {
  geom.type = "Point";
  return pbf2.readMessage(readGeometryField, geom);
}
function readFeatureCollectionField(tag, obj, pbf2) {
  if (tag === 1)
    obj.features.push(readFeature(pbf2, {}));
  else if (tag === 13)
    values.push(readValue(pbf2));
  else if (tag === 15)
    readProps(pbf2, obj);
}
function readFeatureField(tag, feature, pbf2) {
  if (tag === 1)
    feature.geometry = readGeometry(pbf2, {});
  else if (tag === 11)
    feature.id = pbf2.readString();
  else if (tag === 12)
    feature.id = pbf2.readSVarint();
  else if (tag === 13)
    values.push(readValue(pbf2));
  else if (tag === 14)
    feature.properties = readProps(pbf2, {});
  else if (tag === 15)
    readProps(pbf2, feature);
}
function readGeometryField(tag, geom, pbf2) {
  if (tag === 1)
    geom.type = geometryTypes[pbf2.readVarint()];
  else if (tag === 2)
    lengths = pbf2.readPackedVarint();
  else if (tag === 3)
    readCoords(geom, pbf2, geom.type);
  else if (tag === 4) {
    geom.geometries = geom.geometries || [];
    geom.geometries.push(readGeometry(pbf2, {}));
  } else if (tag === 13)
    values.push(readValue(pbf2));
  else if (tag === 15)
    readProps(pbf2, geom);
}
function readCoords(geom, pbf2, type) {
  if (type === "Point")
    geom.coordinates = readPoint(pbf2);
  else if (type === "MultiPoint")
    geom.coordinates = readLine(pbf2);
  else if (type === "LineString")
    geom.coordinates = readLine(pbf2);
  else if (type === "MultiLineString")
    geom.coordinates = readMultiLine(pbf2);
  else if (type === "Polygon")
    geom.coordinates = readMultiLine(pbf2, true);
  else if (type === "MultiPolygon")
    geom.coordinates = readMultiPolygon(pbf2);
}
function readValue(pbf2) {
  var end = pbf2.readVarint() + pbf2.pos, value = null;
  while (pbf2.pos < end) {
    var val = pbf2.readVarint(), tag = val >> 3;
    if (tag === 1)
      value = pbf2.readString();
    else if (tag === 2)
      value = pbf2.readDouble();
    else if (tag === 3)
      value = pbf2.readVarint();
    else if (tag === 4)
      value = -pbf2.readVarint();
    else if (tag === 5)
      value = pbf2.readBoolean();
    else if (tag === 6)
      value = JSON.parse(pbf2.readString());
  }
  return value;
}
function readProps(pbf2, props) {
  var end = pbf2.readVarint() + pbf2.pos;
  while (pbf2.pos < end)
    props[keys[pbf2.readVarint()]] = values[pbf2.readVarint()];
  values = [];
  return props;
}
function readPoint(pbf2) {
  var end = pbf2.readVarint() + pbf2.pos, coords = [];
  while (pbf2.pos < end)
    coords.push(pbf2.readSVarint() / e);
  return coords;
}
function readLinePart(pbf2, end, len, closed) {
  var i = 0, coords = [], p, d;
  var prevP = [];
  for (d = 0; d < dim; d++)
    prevP[d] = 0;
  while (len ? i < len : pbf2.pos < end) {
    p = [];
    for (d = 0; d < dim; d++) {
      prevP[d] += pbf2.readSVarint();
      p[d] = prevP[d] / e;
    }
    coords.push(p);
    i++;
  }
  if (closed)
    coords.push(coords[0]);
  return coords;
}
function readLine(pbf2) {
  return readLinePart(pbf2, pbf2.readVarint() + pbf2.pos);
}
function readMultiLine(pbf2, closed) {
  var end = pbf2.readVarint() + pbf2.pos;
  if (!lengths)
    return [readLinePart(pbf2, end, null, closed)];
  var coords = [];
  for (var i = 0; i < lengths.length; i++)
    coords.push(readLinePart(pbf2, end, lengths[i], closed));
  lengths = null;
  return coords;
}
function readMultiPolygon(pbf2) {
  var end = pbf2.readVarint() + pbf2.pos;
  if (!lengths)
    return [[readLinePart(pbf2, end, null, true)]];
  var coords = [];
  var j = 1;
  for (var i = 0; i < lengths[0]; i++) {
    var rings = [];
    for (var k = 0; k < lengths[j]; k++)
      rings.push(readLinePart(pbf2, end, lengths[j + 1 + k], true));
    j += lengths[j] + 1;
    coords.push(rings);
  }
  lengths = null;
  return coords;
}
var decode = decode_1;
var ieee754$1 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754$1.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e2, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e2 = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e2 = e2 * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e2 & (1 << -nBits) - 1;
  e2 >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e2 === 0) {
    e2 = 1 - eBias;
  } else if (e2 === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e2 = e2 - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e2 - mLen);
};
ieee754$1.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e2, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e2 = eMax;
  } else {
    e2 = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e2)) < 1) {
      e2--;
      c *= 2;
    }
    if (e2 + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e2++;
      c /= 2;
    }
    if (e2 + eBias >= eMax) {
      m = 0;
      e2 = eMax;
    } else if (e2 + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e2 = e2 + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e2 = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e2 = e2 << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e2 & 255, i += d, e2 /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
};
var pbf = Pbf;
var ieee754 = ieee754$1;
function Pbf(buf) {
  this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
  this.pos = 0;
  this.type = 0;
  this.length = this.buf.length;
}
Pbf.Varint = 0;
Pbf.Fixed64 = 1;
Pbf.Bytes = 2;
Pbf.Fixed32 = 5;
var SHIFT_LEFT_32 = (1 << 16) * (1 << 16), SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
var TEXT_DECODER_MIN_LENGTH = 12;
var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf8");
Pbf.prototype = {
  destroy: function() {
    this.buf = null;
  },
  readFields: function(readField, result, end) {
    end = end || this.length;
    while (this.pos < end) {
      var val = this.readVarint(), tag = val >> 3, startPos = this.pos;
      this.type = val & 7;
      readField(tag, result, this);
      if (this.pos === startPos)
        this.skip(val);
    }
    return result;
  },
  readMessage: function(readField, result) {
    return this.readFields(readField, result, this.readVarint() + this.pos);
  },
  readFixed32: function() {
    var val = readUInt32(this.buf, this.pos);
    this.pos += 4;
    return val;
  },
  readSFixed32: function() {
    var val = readInt32(this.buf, this.pos);
    this.pos += 4;
    return val;
  },
  readFixed64: function() {
    var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
    this.pos += 8;
    return val;
  },
  readSFixed64: function() {
    var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
    this.pos += 8;
    return val;
  },
  readFloat: function() {
    var val = ieee754.read(this.buf, this.pos, true, 23, 4);
    this.pos += 4;
    return val;
  },
  readDouble: function() {
    var val = ieee754.read(this.buf, this.pos, true, 52, 8);
    this.pos += 8;
    return val;
  },
  readVarint: function(isSigned) {
    var buf = this.buf, val, b;
    b = buf[this.pos++];
    val = b & 127;
    if (b < 128)
      return val;
    b = buf[this.pos++];
    val |= (b & 127) << 7;
    if (b < 128)
      return val;
    b = buf[this.pos++];
    val |= (b & 127) << 14;
    if (b < 128)
      return val;
    b = buf[this.pos++];
    val |= (b & 127) << 21;
    if (b < 128)
      return val;
    b = buf[this.pos];
    val |= (b & 15) << 28;
    return readVarintRemainder(val, isSigned, this);
  },
  readVarint64: function() {
    return this.readVarint(true);
  },
  readSVarint: function() {
    var num = this.readVarint();
    return num % 2 === 1 ? (num + 1) / -2 : num / 2;
  },
  readBoolean: function() {
    return Boolean(this.readVarint());
  },
  readString: function() {
    var end = this.readVarint() + this.pos;
    var pos = this.pos;
    this.pos = end;
    if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
      return readUtf8TextDecoder(this.buf, pos, end);
    }
    return readUtf8(this.buf, pos, end);
  },
  readBytes: function() {
    var end = this.readVarint() + this.pos, buffer = this.buf.subarray(this.pos, end);
    this.pos = end;
    return buffer;
  },
  readPackedVarint: function(arr, isSigned) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readVarint(isSigned));
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readVarint(isSigned));
    return arr;
  },
  readPackedSVarint: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readSVarint());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readSVarint());
    return arr;
  },
  readPackedBoolean: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readBoolean());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readBoolean());
    return arr;
  },
  readPackedFloat: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readFloat());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readFloat());
    return arr;
  },
  readPackedDouble: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readDouble());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readDouble());
    return arr;
  },
  readPackedFixed32: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readFixed32());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readFixed32());
    return arr;
  },
  readPackedSFixed32: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readSFixed32());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readSFixed32());
    return arr;
  },
  readPackedFixed64: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readFixed64());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readFixed64());
    return arr;
  },
  readPackedSFixed64: function(arr) {
    if (this.type !== Pbf.Bytes)
      return arr.push(this.readSFixed64());
    var end = readPackedEnd(this);
    arr = arr || [];
    while (this.pos < end)
      arr.push(this.readSFixed64());
    return arr;
  },
  skip: function(val) {
    var type = val & 7;
    if (type === Pbf.Varint)
      while (this.buf[this.pos++] > 127) {
      }
    else if (type === Pbf.Bytes)
      this.pos = this.readVarint() + this.pos;
    else if (type === Pbf.Fixed32)
      this.pos += 4;
    else if (type === Pbf.Fixed64)
      this.pos += 8;
    else
      throw new Error("Unimplemented type: " + type);
  },
  writeTag: function(tag, type) {
    this.writeVarint(tag << 3 | type);
  },
  realloc: function(min) {
    var length = this.length || 16;
    while (length < this.pos + min)
      length *= 2;
    if (length !== this.length) {
      var buf = new Uint8Array(length);
      buf.set(this.buf);
      this.buf = buf;
      this.length = length;
    }
  },
  finish: function() {
    this.length = this.pos;
    this.pos = 0;
    return this.buf.subarray(0, this.length);
  },
  writeFixed32: function(val) {
    this.realloc(4);
    writeInt32(this.buf, val, this.pos);
    this.pos += 4;
  },
  writeSFixed32: function(val) {
    this.realloc(4);
    writeInt32(this.buf, val, this.pos);
    this.pos += 4;
  },
  writeFixed64: function(val) {
    this.realloc(8);
    writeInt32(this.buf, val & -1, this.pos);
    writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
    this.pos += 8;
  },
  writeSFixed64: function(val) {
    this.realloc(8);
    writeInt32(this.buf, val & -1, this.pos);
    writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
    this.pos += 8;
  },
  writeVarint: function(val) {
    val = +val || 0;
    if (val > 268435455 || val < 0) {
      writeBigVarint(val, this);
      return;
    }
    this.realloc(4);
    this.buf[this.pos++] = val & 127 | (val > 127 ? 128 : 0);
    if (val <= 127)
      return;
    this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
    if (val <= 127)
      return;
    this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
    if (val <= 127)
      return;
    this.buf[this.pos++] = val >>> 7 & 127;
  },
  writeSVarint: function(val) {
    this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
  },
  writeBoolean: function(val) {
    this.writeVarint(Boolean(val));
  },
  writeString: function(str) {
    str = String(str);
    this.realloc(str.length * 4);
    this.pos++;
    var startPos = this.pos;
    this.pos = writeUtf8(this.buf, str, this.pos);
    var len = this.pos - startPos;
    if (len >= 128)
      makeRoomForExtraLength(startPos, len, this);
    this.pos = startPos - 1;
    this.writeVarint(len);
    this.pos += len;
  },
  writeFloat: function(val) {
    this.realloc(4);
    ieee754.write(this.buf, val, this.pos, true, 23, 4);
    this.pos += 4;
  },
  writeDouble: function(val) {
    this.realloc(8);
    ieee754.write(this.buf, val, this.pos, true, 52, 8);
    this.pos += 8;
  },
  writeBytes: function(buffer) {
    var len = buffer.length;
    this.writeVarint(len);
    this.realloc(len);
    for (var i = 0; i < len; i++)
      this.buf[this.pos++] = buffer[i];
  },
  writeRawMessage: function(fn, obj) {
    this.pos++;
    var startPos = this.pos;
    fn(obj, this);
    var len = this.pos - startPos;
    if (len >= 128)
      makeRoomForExtraLength(startPos, len, this);
    this.pos = startPos - 1;
    this.writeVarint(len);
    this.pos += len;
  },
  writeMessage: function(tag, fn, obj) {
    this.writeTag(tag, Pbf.Bytes);
    this.writeRawMessage(fn, obj);
  },
  writePackedVarint: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedVarint, arr);
  },
  writePackedSVarint: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedSVarint, arr);
  },
  writePackedBoolean: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedBoolean, arr);
  },
  writePackedFloat: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedFloat, arr);
  },
  writePackedDouble: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedDouble, arr);
  },
  writePackedFixed32: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedFixed32, arr);
  },
  writePackedSFixed32: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedSFixed32, arr);
  },
  writePackedFixed64: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedFixed64, arr);
  },
  writePackedSFixed64: function(tag, arr) {
    if (arr.length)
      this.writeMessage(tag, writePackedSFixed64, arr);
  },
  writeBytesField: function(tag, buffer) {
    this.writeTag(tag, Pbf.Bytes);
    this.writeBytes(buffer);
  },
  writeFixed32Field: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed32);
    this.writeFixed32(val);
  },
  writeSFixed32Field: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed32);
    this.writeSFixed32(val);
  },
  writeFixed64Field: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed64);
    this.writeFixed64(val);
  },
  writeSFixed64Field: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed64);
    this.writeSFixed64(val);
  },
  writeVarintField: function(tag, val) {
    this.writeTag(tag, Pbf.Varint);
    this.writeVarint(val);
  },
  writeSVarintField: function(tag, val) {
    this.writeTag(tag, Pbf.Varint);
    this.writeSVarint(val);
  },
  writeStringField: function(tag, str) {
    this.writeTag(tag, Pbf.Bytes);
    this.writeString(str);
  },
  writeFloatField: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed32);
    this.writeFloat(val);
  },
  writeDoubleField: function(tag, val) {
    this.writeTag(tag, Pbf.Fixed64);
    this.writeDouble(val);
  },
  writeBooleanField: function(tag, val) {
    this.writeVarintField(tag, Boolean(val));
  }
};
function readVarintRemainder(l, s, p) {
  var buf = p.buf, h, b;
  b = buf[p.pos++];
  h = (b & 112) >> 4;
  if (b < 128)
    return toNum(l, h, s);
  b = buf[p.pos++];
  h |= (b & 127) << 3;
  if (b < 128)
    return toNum(l, h, s);
  b = buf[p.pos++];
  h |= (b & 127) << 10;
  if (b < 128)
    return toNum(l, h, s);
  b = buf[p.pos++];
  h |= (b & 127) << 17;
  if (b < 128)
    return toNum(l, h, s);
  b = buf[p.pos++];
  h |= (b & 127) << 24;
  if (b < 128)
    return toNum(l, h, s);
  b = buf[p.pos++];
  h |= (b & 1) << 31;
  if (b < 128)
    return toNum(l, h, s);
  throw new Error("Expected varint not more than 10 bytes");
}
function readPackedEnd(pbf2) {
  return pbf2.type === Pbf.Bytes ? pbf2.readVarint() + pbf2.pos : pbf2.pos + 1;
}
function toNum(low, high, isSigned) {
  if (isSigned) {
    return high * 4294967296 + (low >>> 0);
  }
  return (high >>> 0) * 4294967296 + (low >>> 0);
}
function writeBigVarint(val, pbf2) {
  var low, high;
  if (val >= 0) {
    low = val % 4294967296 | 0;
    high = val / 4294967296 | 0;
  } else {
    low = ~(-val % 4294967296);
    high = ~(-val / 4294967296);
    if (low ^ 4294967295) {
      low = low + 1 | 0;
    } else {
      low = 0;
      high = high + 1 | 0;
    }
  }
  if (val >= 18446744073709552e3 || val < -18446744073709552e3) {
    throw new Error("Given varint doesn't fit into 10 bytes");
  }
  pbf2.realloc(10);
  writeBigVarintLow(low, high, pbf2);
  writeBigVarintHigh(high, pbf2);
}
function writeBigVarintLow(low, high, pbf2) {
  pbf2.buf[pbf2.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf2.buf[pbf2.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf2.buf[pbf2.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf2.buf[pbf2.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf2.buf[pbf2.pos] = low & 127;
}
function writeBigVarintHigh(high, pbf2) {
  var lsb = (high & 7) << 4;
  pbf2.buf[pbf2.pos++] |= lsb | ((high >>>= 3) ? 128 : 0);
  if (!high)
    return;
  pbf2.buf[pbf2.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high)
    return;
  pbf2.buf[pbf2.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high)
    return;
  pbf2.buf[pbf2.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high)
    return;
  pbf2.buf[pbf2.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high)
    return;
  pbf2.buf[pbf2.pos++] = high & 127;
}
function makeRoomForExtraLength(startPos, len, pbf2) {
  var extraLen = len <= 16383 ? 1 : len <= 2097151 ? 2 : len <= 268435455 ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));
  pbf2.realloc(extraLen);
  for (var i = pbf2.pos - 1; i >= startPos; i--)
    pbf2.buf[i + extraLen] = pbf2.buf[i];
}
function writePackedVarint(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeVarint(arr[i]);
}
function writePackedSVarint(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeSVarint(arr[i]);
}
function writePackedFloat(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeFloat(arr[i]);
}
function writePackedDouble(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeDouble(arr[i]);
}
function writePackedBoolean(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeBoolean(arr[i]);
}
function writePackedFixed32(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeFixed32(arr[i]);
}
function writePackedSFixed32(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeSFixed32(arr[i]);
}
function writePackedFixed64(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeFixed64(arr[i]);
}
function writePackedSFixed64(arr, pbf2) {
  for (var i = 0; i < arr.length; i++)
    pbf2.writeSFixed64(arr[i]);
}
function readUInt32(buf, pos) {
  return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + buf[pos + 3] * 16777216;
}
function writeInt32(buf, val, pos) {
  buf[pos] = val;
  buf[pos + 1] = val >>> 8;
  buf[pos + 2] = val >>> 16;
  buf[pos + 3] = val >>> 24;
}
function readInt32(buf, pos) {
  return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + (buf[pos + 3] << 24);
}
function readUtf8(buf, pos, end) {
  var str = "";
  var i = pos;
  while (i < end) {
    var b0 = buf[i];
    var c = null;
    var bytesPerSequence = b0 > 239 ? 4 : b0 > 223 ? 3 : b0 > 191 ? 2 : 1;
    if (i + bytesPerSequence > end)
      break;
    var b1, b2, b3;
    if (bytesPerSequence === 1) {
      if (b0 < 128) {
        c = b0;
      }
    } else if (bytesPerSequence === 2) {
      b1 = buf[i + 1];
      if ((b1 & 192) === 128) {
        c = (b0 & 31) << 6 | b1 & 63;
        if (c <= 127) {
          c = null;
        }
      }
    } else if (bytesPerSequence === 3) {
      b1 = buf[i + 1];
      b2 = buf[i + 2];
      if ((b1 & 192) === 128 && (b2 & 192) === 128) {
        c = (b0 & 15) << 12 | (b1 & 63) << 6 | b2 & 63;
        if (c <= 2047 || c >= 55296 && c <= 57343) {
          c = null;
        }
      }
    } else if (bytesPerSequence === 4) {
      b1 = buf[i + 1];
      b2 = buf[i + 2];
      b3 = buf[i + 3];
      if ((b1 & 192) === 128 && (b2 & 192) === 128 && (b3 & 192) === 128) {
        c = (b0 & 15) << 18 | (b1 & 63) << 12 | (b2 & 63) << 6 | b3 & 63;
        if (c <= 65535 || c >= 1114112) {
          c = null;
        }
      }
    }
    if (c === null) {
      c = 65533;
      bytesPerSequence = 1;
    } else if (c > 65535) {
      c -= 65536;
      str += String.fromCharCode(c >>> 10 & 1023 | 55296);
      c = 56320 | c & 1023;
    }
    str += String.fromCharCode(c);
    i += bytesPerSequence;
  }
  return str;
}
function readUtf8TextDecoder(buf, pos, end) {
  return utf8TextDecoder.decode(buf.subarray(pos, end));
}
function writeUtf8(buf, str, pos) {
  for (var i = 0, c, lead; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c > 55295 && c < 57344) {
      if (lead) {
        if (c < 56320) {
          buf[pos++] = 239;
          buf[pos++] = 191;
          buf[pos++] = 189;
          lead = c;
          continue;
        } else {
          c = lead - 55296 << 10 | c - 56320 | 65536;
          lead = null;
        }
      } else {
        if (c > 56319 || i + 1 === str.length) {
          buf[pos++] = 239;
          buf[pos++] = 191;
          buf[pos++] = 189;
        } else {
          lead = c;
        }
        continue;
      }
    } else if (lead) {
      buf[pos++] = 239;
      buf[pos++] = 191;
      buf[pos++] = 189;
      lead = null;
    }
    if (c < 128) {
      buf[pos++] = c;
    } else {
      if (c < 2048) {
        buf[pos++] = c >> 6 | 192;
      } else {
        if (c < 65536) {
          buf[pos++] = c >> 12 | 224;
        } else {
          buf[pos++] = c >> 18 | 240;
          buf[pos++] = c >> 12 & 63 | 128;
        }
        buf[pos++] = c >> 6 & 63 | 128;
      }
      buf[pos++] = c & 63 | 128;
    }
  }
  return pos;
}
const getSourceTypeGPBF = (map) => class GeobufSource extends getGeoJSONSource(map) {
  constructor(id, _a, dispatcher, eventedParent) {
    var _b = _a, { data } = _b, options = __objRest(_b, ["data"]);
    super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
    this.id = id;
    this.type = "geojson";
    this._options.data = data;
    this.setData(data);
  }
  setData(data) {
    if (typeof data === "string" || data instanceof String) {
      var req = new XMLHttpRequest();
      req.open("GET", data);
      req.responseType = "arraybuffer";
      req.addEventListener("load", () => this.setData(req.response));
      req.send();
    } else if (data.byteLength != 0) {
      var geojson = decode(new pbf(data));
      super.setData(geojson);
    } else {
      console.error("GeobufSource expects a URL or a ArrayBuffer as 'data'");
    }
    return this;
  }
};
const addSourceTypeGPBF = function(map, cb) {
  map.addSourceType("geobuf", getSourceTypeGPBF(map), cb);
};
export { addSourceTypeGPBF, addSourceTypeGPBF as default, getSourceTypeGPBF };
