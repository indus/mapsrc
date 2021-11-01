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
class ColumnMeta {
  constructor(name, type, title, description, width, precision, scale, nullable, unique, primary_key) {
    this.name = name;
    this.type = type;
    this.title = title;
    this.description = description;
    this.width = width;
    this.precision = precision;
    this.scale = scale;
    this.nullable = nullable;
    this.unique = unique;
    this.primary_key = primary_key;
  }
}
var ColumnType;
(function(ColumnType2) {
  ColumnType2[ColumnType2["Byte"] = 0] = "Byte";
  ColumnType2[ColumnType2["UByte"] = 1] = "UByte";
  ColumnType2[ColumnType2["Bool"] = 2] = "Bool";
  ColumnType2[ColumnType2["Short"] = 3] = "Short";
  ColumnType2[ColumnType2["UShort"] = 4] = "UShort";
  ColumnType2[ColumnType2["Int"] = 5] = "Int";
  ColumnType2[ColumnType2["UInt"] = 6] = "UInt";
  ColumnType2[ColumnType2["Long"] = 7] = "Long";
  ColumnType2[ColumnType2["ULong"] = 8] = "ULong";
  ColumnType2[ColumnType2["Float"] = 9] = "Float";
  ColumnType2[ColumnType2["Double"] = 10] = "Double";
  ColumnType2[ColumnType2["String"] = 11] = "String";
  ColumnType2[ColumnType2["Json"] = 12] = "Json";
  ColumnType2[ColumnType2["DateTime"] = 13] = "DateTime";
  ColumnType2[ColumnType2["Binary"] = 14] = "Binary";
})(ColumnType || (ColumnType = {}));
class CrsMeta {
  constructor(org, code, name, description, wkt, code_string) {
    this.org = org;
    this.code = code;
    this.name = name;
    this.description = description;
    this.wkt = wkt;
    this.code_string = code_string;
  }
}
const SIZEOF_INT = 4;
const FILE_IDENTIFIER_LENGTH = 4;
const SIZE_PREFIX_LENGTH = 4;
const int32 = new Int32Array(2);
const float32 = new Float32Array(int32.buffer);
const float64 = new Float64Array(int32.buffer);
const isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
class Long {
  constructor(low, high) {
    this.low = low | 0;
    this.high = high | 0;
  }
  static create(low, high) {
    return low == 0 && high == 0 ? Long.ZERO : new Long(low, high);
  }
  toFloat64() {
    return (this.low >>> 0) + this.high * 4294967296;
  }
  equals(other) {
    return this.low == other.low && this.high == other.high;
  }
}
Long.ZERO = new Long(0, 0);
var Encoding;
(function(Encoding2) {
  Encoding2[Encoding2["UTF8_BYTES"] = 1] = "UTF8_BYTES";
  Encoding2[Encoding2["UTF16_STRING"] = 2] = "UTF16_STRING";
})(Encoding || (Encoding = {}));
class ByteBuffer {
  constructor(bytes_) {
    this.bytes_ = bytes_;
    this.position_ = 0;
  }
  static allocate(byte_size) {
    return new ByteBuffer(new Uint8Array(byte_size));
  }
  clear() {
    this.position_ = 0;
  }
  bytes() {
    return this.bytes_;
  }
  position() {
    return this.position_;
  }
  setPosition(position) {
    this.position_ = position;
  }
  capacity() {
    return this.bytes_.length;
  }
  readInt8(offset) {
    return this.readUint8(offset) << 24 >> 24;
  }
  readUint8(offset) {
    return this.bytes_[offset];
  }
  readInt16(offset) {
    return this.readUint16(offset) << 16 >> 16;
  }
  readUint16(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
  }
  readInt32(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
  }
  readUint32(offset) {
    return this.readInt32(offset) >>> 0;
  }
  readInt64(offset) {
    return new Long(this.readInt32(offset), this.readInt32(offset + 4));
  }
  readUint64(offset) {
    return new Long(this.readUint32(offset), this.readUint32(offset + 4));
  }
  readFloat32(offset) {
    int32[0] = this.readInt32(offset);
    return float32[0];
  }
  readFloat64(offset) {
    int32[isLittleEndian ? 0 : 1] = this.readInt32(offset);
    int32[isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
    return float64[0];
  }
  writeInt8(offset, value) {
    this.bytes_[offset] = value;
  }
  writeUint8(offset, value) {
    this.bytes_[offset] = value;
  }
  writeInt16(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
  }
  writeUint16(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
  }
  writeInt32(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
  }
  writeUint32(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
  }
  writeInt64(offset, value) {
    this.writeInt32(offset, value.low);
    this.writeInt32(offset + 4, value.high);
  }
  writeUint64(offset, value) {
    this.writeUint32(offset, value.low);
    this.writeUint32(offset + 4, value.high);
  }
  writeFloat32(offset, value) {
    float32[0] = value;
    this.writeInt32(offset, int32[0]);
  }
  writeFloat64(offset, value) {
    float64[0] = value;
    this.writeInt32(offset, int32[isLittleEndian ? 0 : 1]);
    this.writeInt32(offset + 4, int32[isLittleEndian ? 1 : 0]);
  }
  getBufferIdentifier() {
    if (this.bytes_.length < this.position_ + SIZEOF_INT + FILE_IDENTIFIER_LENGTH) {
      throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
    }
    let result = "";
    for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
      result += String.fromCharCode(this.readInt8(this.position_ + SIZEOF_INT + i));
    }
    return result;
  }
  __offset(bb_pos, vtable_offset) {
    const vtable = bb_pos - this.readInt32(bb_pos);
    return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
  }
  __union(t, offset) {
    t.bb_pos = offset + this.readInt32(offset);
    t.bb = this;
    return t;
  }
  __string(offset, opt_encoding) {
    offset += this.readInt32(offset);
    const length = this.readInt32(offset);
    let result = "";
    let i = 0;
    offset += SIZEOF_INT;
    if (opt_encoding === Encoding.UTF8_BYTES) {
      return this.bytes_.subarray(offset, offset + length);
    }
    while (i < length) {
      let codePoint;
      const a = this.readUint8(offset + i++);
      if (a < 192) {
        codePoint = a;
      } else {
        const b = this.readUint8(offset + i++);
        if (a < 224) {
          codePoint = (a & 31) << 6 | b & 63;
        } else {
          const c = this.readUint8(offset + i++);
          if (a < 240) {
            codePoint = (a & 15) << 12 | (b & 63) << 6 | c & 63;
          } else {
            const d = this.readUint8(offset + i++);
            codePoint = (a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63;
          }
        }
      }
      if (codePoint < 65536) {
        result += String.fromCharCode(codePoint);
      } else {
        codePoint -= 65536;
        result += String.fromCharCode((codePoint >> 10) + 55296, (codePoint & (1 << 10) - 1) + 56320);
      }
    }
    return result;
  }
  __union_with_string(o, offset) {
    if (typeof o === "string") {
      return this.__string(offset);
    }
    return this.__union(o, offset);
  }
  __indirect(offset) {
    return offset + this.readInt32(offset);
  }
  __vector(offset) {
    return offset + this.readInt32(offset) + SIZEOF_INT;
  }
  __vector_len(offset) {
    return this.readInt32(offset + this.readInt32(offset));
  }
  __has_identifier(ident) {
    if (ident.length != FILE_IDENTIFIER_LENGTH) {
      throw new Error("FlatBuffers: file identifier must be length " + FILE_IDENTIFIER_LENGTH);
    }
    for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
      if (ident.charCodeAt(i) != this.readInt8(this.position() + SIZEOF_INT + i)) {
        return false;
      }
    }
    return true;
  }
  createLong(low, high) {
    return Long.create(low, high);
  }
  createScalarList(listAccessor, listLength) {
    const ret = [];
    for (let i = 0; i < listLength; ++i) {
      if (listAccessor(i) !== null) {
        ret.push(listAccessor(i));
      }
    }
    return ret;
  }
  createObjList(listAccessor, listLength) {
    const ret = [];
    for (let i = 0; i < listLength; ++i) {
      const val = listAccessor(i);
      if (val !== null) {
        ret.push(val.unpack());
      }
    }
    return ret;
  }
}
class Column {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsColumn(bb, obj) {
    return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsColumn(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  name(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  type() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : ColumnType.Byte;
  }
  title(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  description(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  width() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
  }
  precision() {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
  }
  scale() {
    const offset = this.bb.__offset(this.bb_pos, 16);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
  }
  nullable() {
    const offset = this.bb.__offset(this.bb_pos, 18);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : true;
  }
  unique() {
    const offset = this.bb.__offset(this.bb_pos, 20);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  primaryKey() {
    const offset = this.bb.__offset(this.bb_pos, 22);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  metadata(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 24);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startColumn(builder) {
    builder.startObject(11);
  }
  static addName(builder, nameOffset) {
    builder.addFieldOffset(0, nameOffset, 0);
  }
  static addType(builder, type) {
    builder.addFieldInt8(1, type, ColumnType.Byte);
  }
  static addTitle(builder, titleOffset) {
    builder.addFieldOffset(2, titleOffset, 0);
  }
  static addDescription(builder, descriptionOffset) {
    builder.addFieldOffset(3, descriptionOffset, 0);
  }
  static addWidth(builder, width) {
    builder.addFieldInt32(4, width, -1);
  }
  static addPrecision(builder, precision) {
    builder.addFieldInt32(5, precision, -1);
  }
  static addScale(builder, scale) {
    builder.addFieldInt32(6, scale, -1);
  }
  static addNullable(builder, nullable) {
    builder.addFieldInt8(7, +nullable, 1);
  }
  static addUnique(builder, unique) {
    builder.addFieldInt8(8, +unique, 0);
  }
  static addPrimaryKey(builder, primaryKey) {
    builder.addFieldInt8(9, +primaryKey, 0);
  }
  static addMetadata(builder, metadataOffset) {
    builder.addFieldOffset(10, metadataOffset, 0);
  }
  static endColumn(builder) {
    const offset = builder.endObject();
    builder.requiredField(offset, 4);
    return offset;
  }
  static createColumn(builder, nameOffset, type, titleOffset, descriptionOffset, width, precision, scale, nullable, unique, primaryKey, metadataOffset) {
    Column.startColumn(builder);
    Column.addName(builder, nameOffset);
    Column.addType(builder, type);
    Column.addTitle(builder, titleOffset);
    Column.addDescription(builder, descriptionOffset);
    Column.addWidth(builder, width);
    Column.addPrecision(builder, precision);
    Column.addScale(builder, scale);
    Column.addNullable(builder, nullable);
    Column.addUnique(builder, unique);
    Column.addPrimaryKey(builder, primaryKey);
    Column.addMetadata(builder, metadataOffset);
    return Column.endColumn(builder);
  }
}
class Crs {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsCrs(bb, obj) {
    return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsCrs(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  org(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  code() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  name(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  description(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  wkt(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  codeString(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startCrs(builder) {
    builder.startObject(6);
  }
  static addOrg(builder, orgOffset) {
    builder.addFieldOffset(0, orgOffset, 0);
  }
  static addCode(builder, code) {
    builder.addFieldInt32(1, code, 0);
  }
  static addName(builder, nameOffset) {
    builder.addFieldOffset(2, nameOffset, 0);
  }
  static addDescription(builder, descriptionOffset) {
    builder.addFieldOffset(3, descriptionOffset, 0);
  }
  static addWkt(builder, wktOffset) {
    builder.addFieldOffset(4, wktOffset, 0);
  }
  static addCodeString(builder, codeStringOffset) {
    builder.addFieldOffset(5, codeStringOffset, 0);
  }
  static endCrs(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createCrs(builder, orgOffset, code, nameOffset, descriptionOffset, wktOffset, codeStringOffset) {
    Crs.startCrs(builder);
    Crs.addOrg(builder, orgOffset);
    Crs.addCode(builder, code);
    Crs.addName(builder, nameOffset);
    Crs.addDescription(builder, descriptionOffset);
    Crs.addWkt(builder, wktOffset);
    Crs.addCodeString(builder, codeStringOffset);
    return Crs.endCrs(builder);
  }
}
var GeometryType;
(function(GeometryType2) {
  GeometryType2[GeometryType2["Unknown"] = 0] = "Unknown";
  GeometryType2[GeometryType2["Point"] = 1] = "Point";
  GeometryType2[GeometryType2["LineString"] = 2] = "LineString";
  GeometryType2[GeometryType2["Polygon"] = 3] = "Polygon";
  GeometryType2[GeometryType2["MultiPoint"] = 4] = "MultiPoint";
  GeometryType2[GeometryType2["MultiLineString"] = 5] = "MultiLineString";
  GeometryType2[GeometryType2["MultiPolygon"] = 6] = "MultiPolygon";
  GeometryType2[GeometryType2["GeometryCollection"] = 7] = "GeometryCollection";
  GeometryType2[GeometryType2["CircularString"] = 8] = "CircularString";
  GeometryType2[GeometryType2["CompoundCurve"] = 9] = "CompoundCurve";
  GeometryType2[GeometryType2["CurvePolygon"] = 10] = "CurvePolygon";
  GeometryType2[GeometryType2["MultiCurve"] = 11] = "MultiCurve";
  GeometryType2[GeometryType2["MultiSurface"] = 12] = "MultiSurface";
  GeometryType2[GeometryType2["Curve"] = 13] = "Curve";
  GeometryType2[GeometryType2["Surface"] = 14] = "Surface";
  GeometryType2[GeometryType2["PolyhedralSurface"] = 15] = "PolyhedralSurface";
  GeometryType2[GeometryType2["TIN"] = 16] = "TIN";
  GeometryType2[GeometryType2["Triangle"] = 17] = "Triangle";
})(GeometryType || (GeometryType = {}));
class Header {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsHeader(bb, obj) {
    return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsHeader(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  name(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  envelope(index) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
  }
  envelopeLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  envelopeArray() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  geometryType() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : GeometryType.Unknown;
  }
  hasZ() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  hasM() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  hasT() {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  hasTm() {
    const offset = this.bb.__offset(this.bb_pos, 16);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  columns(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 18);
    return offset ? (obj || new Column()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  columnsLength() {
    const offset = this.bb.__offset(this.bb_pos, 18);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  featuresCount() {
    const offset = this.bb.__offset(this.bb_pos, 20);
    return offset ? this.bb.readUint64(this.bb_pos + offset) : this.bb.createLong(0, 0);
  }
  indexNodeSize() {
    const offset = this.bb.__offset(this.bb_pos, 22);
    return offset ? this.bb.readUint16(this.bb_pos + offset) : 16;
  }
  crs(obj) {
    const offset = this.bb.__offset(this.bb_pos, 24);
    return offset ? (obj || new Crs()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  title(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 26);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  description(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 28);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  metadata(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 30);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startHeader(builder) {
    builder.startObject(14);
  }
  static addName(builder, nameOffset) {
    builder.addFieldOffset(0, nameOffset, 0);
  }
  static addEnvelope(builder, envelopeOffset) {
    builder.addFieldOffset(1, envelopeOffset, 0);
  }
  static createEnvelopeVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat64(data[i]);
    }
    return builder.endVector();
  }
  static startEnvelopeVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addGeometryType(builder, geometryType) {
    builder.addFieldInt8(2, geometryType, GeometryType.Unknown);
  }
  static addHasZ(builder, hasZ) {
    builder.addFieldInt8(3, +hasZ, 0);
  }
  static addHasM(builder, hasM) {
    builder.addFieldInt8(4, +hasM, 0);
  }
  static addHasT(builder, hasT) {
    builder.addFieldInt8(5, +hasT, 0);
  }
  static addHasTm(builder, hasTm) {
    builder.addFieldInt8(6, +hasTm, 0);
  }
  static addColumns(builder, columnsOffset) {
    builder.addFieldOffset(7, columnsOffset, 0);
  }
  static createColumnsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startColumnsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static addFeaturesCount(builder, featuresCount) {
    builder.addFieldInt64(8, featuresCount, builder.createLong(0, 0));
  }
  static addIndexNodeSize(builder, indexNodeSize) {
    builder.addFieldInt16(9, indexNodeSize, 16);
  }
  static addCrs(builder, crsOffset) {
    builder.addFieldOffset(10, crsOffset, 0);
  }
  static addTitle(builder, titleOffset) {
    builder.addFieldOffset(11, titleOffset, 0);
  }
  static addDescription(builder, descriptionOffset) {
    builder.addFieldOffset(12, descriptionOffset, 0);
  }
  static addMetadata(builder, metadataOffset) {
    builder.addFieldOffset(13, metadataOffset, 0);
  }
  static endHeader(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishHeaderBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedHeaderBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
}
class HeaderMeta {
  constructor(geometryType, columns, featuresCount, indexNodeSize, crs, title, description, metadata) {
    this.geometryType = geometryType;
    this.columns = columns;
    this.featuresCount = featuresCount;
    this.indexNodeSize = indexNodeSize;
    this.crs = crs;
    this.title = title;
    this.description = description;
    this.metadata = metadata;
  }
  static fromByteBuffer(bb) {
    const header = Header.getRootAsHeader(bb);
    const featuresCount = header.featuresCount().toFloat64();
    const indexNodeSize = header.indexNodeSize();
    const columns = [];
    for (let j = 0; j < header.columnsLength(); j++) {
      const column = header.columns(j);
      if (!column)
        throw new Error("Column unexpectedly missing");
      if (!column.name())
        throw new Error("Column name unexpectedly missing");
      columns.push(new ColumnMeta(column.name(), column.type(), column.title(), column.description(), column.width(), column.precision(), column.scale(), column.nullable(), column.unique(), column.primaryKey()));
    }
    const crs = header.crs();
    const crsMeta = crs ? new CrsMeta(crs.org(), crs.code(), crs.name(), crs.description(), crs.wkt(), crs.codeString()) : null;
    const headerMeta = new HeaderMeta(header.geometryType(), columns, featuresCount, indexNodeSize, crsMeta, header.title(), header.description(), header.metadata());
    return headerMeta;
  }
}
class Geometry {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsGeometry(bb, obj) {
    return (obj || new Geometry()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsGeometry(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new Geometry()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  ends(index) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
  }
  endsLength() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  endsArray() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  xy(index) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
  }
  xyLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  xyArray() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  z(index) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
  }
  zLength() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  zArray() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  m(index) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
  }
  mLength() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  mArray() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  t(index) {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
  }
  tLength() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  tArray() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  tm(index) {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? this.bb.readUint64(this.bb.__vector(this.bb_pos + offset) + index * 8) : this.bb.createLong(0, 0);
  }
  tmLength() {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  type() {
    const offset = this.bb.__offset(this.bb_pos, 16);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : GeometryType.Unknown;
  }
  parts(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 18);
    return offset ? (obj || new Geometry()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  partsLength() {
    const offset = this.bb.__offset(this.bb_pos, 18);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startGeometry(builder) {
    builder.startObject(8);
  }
  static addEnds(builder, endsOffset) {
    builder.addFieldOffset(0, endsOffset, 0);
  }
  static createEndsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addInt32(data[i]);
    }
    return builder.endVector();
  }
  static startEndsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static addXy(builder, xyOffset) {
    builder.addFieldOffset(1, xyOffset, 0);
  }
  static createXyVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat64(data[i]);
    }
    return builder.endVector();
  }
  static startXyVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addZ(builder, zOffset) {
    builder.addFieldOffset(2, zOffset, 0);
  }
  static createZVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat64(data[i]);
    }
    return builder.endVector();
  }
  static startZVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addM(builder, mOffset) {
    builder.addFieldOffset(3, mOffset, 0);
  }
  static createMVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat64(data[i]);
    }
    return builder.endVector();
  }
  static startMVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addT(builder, tOffset) {
    builder.addFieldOffset(4, tOffset, 0);
  }
  static createTVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat64(data[i]);
    }
    return builder.endVector();
  }
  static startTVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addTm(builder, tmOffset) {
    builder.addFieldOffset(5, tmOffset, 0);
  }
  static createTmVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addInt64(data[i]);
    }
    return builder.endVector();
  }
  static startTmVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static addType(builder, type) {
    builder.addFieldInt8(6, type, GeometryType.Unknown);
  }
  static addParts(builder, partsOffset) {
    builder.addFieldOffset(7, partsOffset, 0);
  }
  static createPartsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startPartsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endGeometry(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createGeometry(builder, endsOffset, xyOffset, zOffset, mOffset, tOffset, tmOffset, type, partsOffset) {
    Geometry.startGeometry(builder);
    Geometry.addEnds(builder, endsOffset);
    Geometry.addXy(builder, xyOffset);
    Geometry.addZ(builder, zOffset);
    Geometry.addM(builder, mOffset);
    Geometry.addT(builder, tOffset);
    Geometry.addTm(builder, tmOffset);
    Geometry.addType(builder, type);
    Geometry.addParts(builder, partsOffset);
    return Geometry.endGeometry(builder);
  }
}
function pairFlatCoordinates(xy, z) {
  const newArray = [];
  for (let i = 0; i < xy.length; i += 2) {
    const a = [xy[i], xy[i + 1]];
    if (z)
      a.push(z[i >> 1]);
    newArray.push(a);
  }
  return newArray;
}
function extractParts(xy, z, ends) {
  if (!ends || ends.length === 0)
    return [pairFlatCoordinates(xy, z)];
  let s = 0;
  const xySlices = Array.from(ends).map((e) => xy.slice(s, s = e << 1));
  let zSlices;
  if (z) {
    s = 0;
    zSlices = Array.from(ends).map((e) => z.slice(s, s = e));
  }
  return xySlices.map((xy2, i) => pairFlatCoordinates(xy2, zSlices ? zSlices[i] : void 0));
}
function toGeoJsonCoordinates(geometry, type) {
  const xy = geometry.xyArray();
  const z = geometry.zArray();
  switch (type) {
    case GeometryType.Point: {
      const a = Array.from(xy);
      if (z)
        a.push(z[0]);
      return a;
    }
    case GeometryType.MultiPoint:
    case GeometryType.LineString:
      return pairFlatCoordinates(xy, z);
    case GeometryType.MultiLineString:
      return extractParts(xy, z, geometry.endsArray());
    case GeometryType.Polygon:
      return extractParts(xy, z, geometry.endsArray());
  }
}
function fromGeometry(geometry, type) {
  if (type === GeometryType.GeometryCollection) {
    const geometries = [];
    for (let i = 0; i < geometry.partsLength(); i++) {
      const part = geometry.parts(i);
      const partType = part.type();
      geometries.push(fromGeometry(part, partType));
    }
    return {
      type: GeometryType[type],
      geometries
    };
  } else if (type === GeometryType.MultiPolygon) {
    const geometries = [];
    for (let i = 0; i < geometry.partsLength(); i++)
      geometries.push(fromGeometry(geometry.parts(i), GeometryType.Polygon));
    return {
      type: GeometryType[type],
      coordinates: geometries.map((g) => g.coordinates)
    };
  }
  const coordinates = toGeoJsonCoordinates(geometry, type);
  return {
    type: GeometryType[type],
    coordinates
  };
}
class Feature {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsFeature(bb, obj) {
    return (obj || new Feature()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsFeature(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new Feature()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  geometry(obj) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? (obj || new Geometry()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  properties(index) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
  }
  propertiesLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  propertiesArray() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  columns(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? (obj || new Column()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  columnsLength() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startFeature(builder) {
    builder.startObject(3);
  }
  static addGeometry(builder, geometryOffset) {
    builder.addFieldOffset(0, geometryOffset, 0);
  }
  static addProperties(builder, propertiesOffset) {
    builder.addFieldOffset(1, propertiesOffset, 0);
  }
  static createPropertiesVector(builder, data) {
    builder.startVector(1, data.length, 1);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addInt8(data[i]);
    }
    return builder.endVector();
  }
  static startPropertiesVector(builder, numElems) {
    builder.startVector(1, numElems, 1);
  }
  static addColumns(builder, columnsOffset) {
    builder.addFieldOffset(2, columnsOffset, 0);
  }
  static createColumnsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startColumnsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endFeature(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishFeatureBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedFeatureBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
  static createFeature(builder, geometryOffset, propertiesOffset, columnsOffset) {
    Feature.startFeature(builder);
    Feature.addGeometry(builder, geometryOffset);
    Feature.addProperties(builder, propertiesOffset);
    Feature.addColumns(builder, columnsOffset);
    return Feature.endFeature(builder);
  }
}
new TextEncoder();
const textDecoder = new TextDecoder();
function parseProperties(feature, columns) {
  const properties = {};
  if (!columns || columns.length === 0)
    return properties;
  const array = feature.propertiesArray();
  if (!array)
    return properties;
  const view = new DataView(array.buffer, array.byteOffset);
  const length = feature.propertiesLength();
  let offset = 0;
  while (offset < length) {
    const i = view.getUint16(offset, true);
    offset += 2;
    const column = columns[i];
    const name = column.name;
    switch (column.type) {
      case ColumnType.Bool: {
        properties[name] = !!view.getUint8(offset);
        offset += 1;
        break;
      }
      case ColumnType.Byte: {
        properties[name] = view.getInt8(offset);
        offset += 1;
        break;
      }
      case ColumnType.UByte: {
        properties[name] = view.getUint8(offset);
        offset += 1;
        break;
      }
      case ColumnType.Short: {
        properties[name] = view.getInt16(offset, true);
        offset += 2;
        break;
      }
      case ColumnType.UShort: {
        properties[name] = view.getUint16(offset, true);
        offset += 2;
        break;
      }
      case ColumnType.Int: {
        properties[name] = view.getInt32(offset, true);
        offset += 4;
        break;
      }
      case ColumnType.UInt: {
        properties[name] = view.getUint32(offset, true);
        offset += 4;
        break;
      }
      case ColumnType.Long: {
        properties[name] = Number(view.getBigInt64(offset, true));
        offset += 8;
        break;
      }
      case ColumnType.ULong: {
        properties[name] = Number(view.getBigUint64(offset, true));
        offset += 8;
        break;
      }
      case ColumnType.Double: {
        properties[name] = view.getFloat64(offset, true);
        offset += 8;
        break;
      }
      case ColumnType.DateTime:
      case ColumnType.String: {
        const length2 = view.getUint32(offset, true);
        offset += 4;
        properties[name] = textDecoder.decode(array.subarray(offset, offset + length2));
        offset += length2;
        break;
      }
      default:
        throw new Error("Unknown type " + column.type);
    }
  }
  return properties;
}
function fromFeature(feature, header) {
  const columns = header.columns;
  const geometry = fromGeometry(feature.geometry(), header.geometryType);
  const geoJsonfeature = {
    type: "Feature",
    geometry
  };
  if (columns && columns.length > 0)
    geoJsonfeature.properties = parseProperties(feature, columns);
  return geoJsonfeature;
}
var empty = new Uint8Array(0);
function slice_cancel() {
  return this._source.cancel();
}
function concat(a, b) {
  if (!a.length)
    return b;
  if (!b.length)
    return a;
  var c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}
function slice_read() {
  var that = this, array = that._array.subarray(that._index);
  return that._source.read().then(function(result) {
    that._array = empty;
    that._index = 0;
    return result.done ? array.length > 0 ? { done: false, value: array } : { done: true, value: void 0 } : { done: false, value: concat(array, result.value) };
  });
}
function slice_slice(length) {
  if ((length |= 0) < 0)
    throw new Error("invalid length");
  var that = this, index = this._array.length - this._index;
  if (this._index + length <= this._array.length) {
    return Promise.resolve(this._array.subarray(this._index, this._index += length));
  }
  var array = new Uint8Array(length);
  array.set(this._array.subarray(this._index));
  return function read() {
    return that._source.read().then(function(result) {
      if (result.done) {
        that._array = empty;
        that._index = 0;
        return index > 0 ? array.subarray(0, index) : null;
      }
      if (index + result.value.length >= length) {
        that._array = result.value;
        that._index = length - index;
        array.set(result.value.subarray(0, length - index), index);
        return array;
      }
      array.set(result.value, index);
      index += result.value.length;
      return read();
    });
  }();
}
function slice(source) {
  return typeof source.slice === "function" ? source : new SliceSource(typeof source.read === "function" ? source : source.getReader());
}
function SliceSource(source) {
  this._source = source;
  this._array = empty;
  this._index = 0;
}
SliceSource.prototype.read = slice_read;
SliceSource.prototype.slice = slice_slice;
SliceSource.prototype.cancel = slice_cancel;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (b2.hasOwnProperty(p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
var RepeaterOverflowError = function(_super) {
  __extends(RepeaterOverflowError2, _super);
  function RepeaterOverflowError2(message) {
    var _this = _super.call(this, message) || this;
    Object.defineProperty(_this, "name", {
      value: "RepeaterOverflowError",
      enumerable: false
    });
    if (typeof Object.setPrototypeOf === "function") {
      Object.setPrototypeOf(_this, _this.constructor.prototype);
    } else {
      _this.__proto__ = _this.constructor.prototype;
    }
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(_this, _this.constructor);
    }
    return _this;
  }
  return RepeaterOverflowError2;
}(Error);
(function() {
  function FixedBuffer(capacity) {
    if (capacity < 0) {
      throw new RangeError("Capacity may not be less than 0");
    }
    this._c = capacity;
    this._q = [];
  }
  Object.defineProperty(FixedBuffer.prototype, "empty", {
    get: function() {
      return this._q.length === 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(FixedBuffer.prototype, "full", {
    get: function() {
      return this._q.length >= this._c;
    },
    enumerable: false,
    configurable: true
  });
  FixedBuffer.prototype.add = function(value) {
    if (this.full) {
      throw new Error("Buffer full");
    } else {
      this._q.push(value);
    }
  };
  FixedBuffer.prototype.remove = function() {
    if (this.empty) {
      throw new Error("Buffer empty");
    }
    return this._q.shift();
  };
  return FixedBuffer;
})();
(function() {
  function SlidingBuffer(capacity) {
    if (capacity < 1) {
      throw new RangeError("Capacity may not be less than 1");
    }
    this._c = capacity;
    this._q = [];
  }
  Object.defineProperty(SlidingBuffer.prototype, "empty", {
    get: function() {
      return this._q.length === 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SlidingBuffer.prototype, "full", {
    get: function() {
      return false;
    },
    enumerable: false,
    configurable: true
  });
  SlidingBuffer.prototype.add = function(value) {
    while (this._q.length >= this._c) {
      this._q.shift();
    }
    this._q.push(value);
  };
  SlidingBuffer.prototype.remove = function() {
    if (this.empty) {
      throw new Error("Buffer empty");
    }
    return this._q.shift();
  };
  return SlidingBuffer;
})();
(function() {
  function DroppingBuffer(capacity) {
    if (capacity < 1) {
      throw new RangeError("Capacity may not be less than 1");
    }
    this._c = capacity;
    this._q = [];
  }
  Object.defineProperty(DroppingBuffer.prototype, "empty", {
    get: function() {
      return this._q.length === 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DroppingBuffer.prototype, "full", {
    get: function() {
      return false;
    },
    enumerable: false,
    configurable: true
  });
  DroppingBuffer.prototype.add = function(value) {
    if (this._q.length < this._c) {
      this._q.push(value);
    }
  };
  DroppingBuffer.prototype.remove = function() {
    if (this.empty) {
      throw new Error("Buffer empty");
    }
    return this._q.shift();
  };
  return DroppingBuffer;
})();
function swallow(value) {
  if (value != null && typeof value.then === "function") {
    value.then(NOOP, NOOP);
  }
}
var Initial = 0;
var Started = 1;
var Stopped = 2;
var Done = 3;
var Rejected = 4;
var MAX_QUEUE_LENGTH = 1024;
var NOOP = function() {
};
function consumeExecution(r) {
  var err = r.err;
  var execution = Promise.resolve(r.execution).then(function(value) {
    if (err != null) {
      throw err;
    }
    return value;
  });
  r.err = void 0;
  r.execution = execution.then(function() {
    return void 0;
  }, function() {
    return void 0;
  });
  return r.pending === void 0 ? execution : r.pending.then(function() {
    return execution;
  });
}
function createIteration(r, value) {
  var done = r.state >= Done;
  return Promise.resolve(value).then(function(value2) {
    if (!done && r.state >= Rejected) {
      return consumeExecution(r).then(function(value3) {
        return {
          value: value3,
          done: true
        };
      });
    }
    return { value: value2, done };
  });
}
function stop(r, err) {
  var e_1, _a;
  if (r.state >= Stopped) {
    return;
  }
  r.state = Stopped;
  r.onnext();
  r.onstop();
  if (r.err == null) {
    r.err = err;
  }
  if (r.pushes.length === 0 && (typeof r.buffer === "undefined" || r.buffer.empty)) {
    finish(r);
  } else {
    try {
      for (var _b = __values(r.pushes), _d = _b.next(); !_d.done; _d = _b.next()) {
        var push_1 = _d.value;
        push_1.resolve();
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _b.return))
          _a.call(_b);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
  }
}
function finish(r) {
  var e_2, _a;
  if (r.state >= Done) {
    return;
  }
  if (r.state < Stopped) {
    stop(r);
  }
  r.state = Done;
  r.buffer = void 0;
  try {
    for (var _b = __values(r.nexts), _d = _b.next(); !_d.done; _d = _b.next()) {
      var next = _d.value;
      var execution = r.pending === void 0 ? consumeExecution(r) : r.pending.then(function() {
        return consumeExecution(r);
      });
      next.resolve(createIteration(r, execution));
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (_d && !_d.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_2)
        throw e_2.error;
    }
  }
  r.pushes = [];
  r.nexts = [];
}
function reject(r) {
  if (r.state >= Rejected) {
    return;
  }
  if (r.state < Done) {
    finish(r);
  }
  r.state = Rejected;
}
function push(r, value) {
  swallow(value);
  if (r.pushes.length >= MAX_QUEUE_LENGTH) {
    throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to push are allowed on a single repeater.");
  } else if (r.state >= Stopped) {
    return Promise.resolve(void 0);
  }
  var valueP = r.pending === void 0 ? Promise.resolve(value) : r.pending.then(function() {
    return value;
  });
  valueP = valueP.catch(function(err) {
    if (r.state < Stopped) {
      r.err = err;
    }
    reject(r);
    return void 0;
  });
  var nextP;
  if (r.nexts.length) {
    var next_1 = r.nexts.shift();
    next_1.resolve(createIteration(r, valueP));
    if (r.nexts.length) {
      nextP = Promise.resolve(r.nexts[0].value);
    } else {
      nextP = new Promise(function(resolve) {
        return r.onnext = resolve;
      });
    }
  } else if (typeof r.buffer !== "undefined" && !r.buffer.full) {
    r.buffer.add(valueP);
    nextP = Promise.resolve(void 0);
  } else {
    nextP = new Promise(function(resolve) {
      return r.pushes.push({ resolve, value: valueP });
    });
  }
  var floating = true;
  var next = {};
  var unhandled = nextP.catch(function(err) {
    if (floating) {
      throw err;
    }
    return void 0;
  });
  next.then = function(onfulfilled, onrejected) {
    floating = false;
    return Promise.prototype.then.call(nextP, onfulfilled, onrejected);
  };
  next.catch = function(onrejected) {
    floating = false;
    return Promise.prototype.catch.call(nextP, onrejected);
  };
  next.finally = nextP.finally.bind(nextP);
  r.pending = valueP.then(function() {
    return unhandled;
  }).catch(function(err) {
    r.err = err;
    reject(r);
  });
  return next;
}
function createStop(r) {
  var stop1 = stop.bind(null, r);
  var stopP = new Promise(function(resolve) {
    return r.onstop = resolve;
  });
  stop1.then = stopP.then.bind(stopP);
  stop1.catch = stopP.catch.bind(stopP);
  stop1.finally = stopP.finally.bind(stopP);
  return stop1;
}
function execute(r) {
  if (r.state >= Started) {
    return;
  }
  r.state = Started;
  var push1 = push.bind(null, r);
  var stop1 = createStop(r);
  r.execution = new Promise(function(resolve) {
    return resolve(r.executor(push1, stop1));
  });
  r.execution.catch(function() {
    return stop(r);
  });
}
var records = new WeakMap();
var Repeater = function() {
  function Repeater2(executor, buffer) {
    records.set(this, {
      executor,
      buffer,
      err: void 0,
      state: Initial,
      pushes: [],
      nexts: [],
      pending: void 0,
      execution: void 0,
      onnext: NOOP,
      onstop: NOOP
    });
  }
  Repeater2.prototype.next = function(value) {
    swallow(value);
    var r = records.get(this);
    if (r === void 0) {
      throw new Error("WeakMap error");
    }
    if (r.nexts.length >= MAX_QUEUE_LENGTH) {
      throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to next are allowed on a single repeater.");
    }
    if (r.state <= Initial) {
      execute(r);
    }
    r.onnext(value);
    if (typeof r.buffer !== "undefined" && !r.buffer.empty) {
      var result = createIteration(r, r.buffer.remove());
      if (r.pushes.length) {
        var push_2 = r.pushes.shift();
        r.buffer.add(push_2.value);
        r.onnext = push_2.resolve;
      }
      return result;
    } else if (r.pushes.length) {
      var push_3 = r.pushes.shift();
      r.onnext = push_3.resolve;
      return createIteration(r, push_3.value);
    } else if (r.state >= Stopped) {
      finish(r);
      return createIteration(r, consumeExecution(r));
    }
    return new Promise(function(resolve) {
      return r.nexts.push({ resolve, value });
    });
  };
  Repeater2.prototype.return = function(value) {
    swallow(value);
    var r = records.get(this);
    if (r === void 0) {
      throw new Error("WeakMap error");
    }
    finish(r);
    r.execution = Promise.resolve(r.execution).then(function() {
      return value;
    });
    return createIteration(r, consumeExecution(r));
  };
  Repeater2.prototype.throw = function(err) {
    var r = records.get(this);
    if (r === void 0) {
      throw new Error("WeakMap error");
    }
    if (r.state <= Initial || r.state >= Stopped || typeof r.buffer !== "undefined" && !r.buffer.empty) {
      finish(r);
      if (r.err == null) {
        r.err = err;
      }
      return createIteration(r, consumeExecution(r));
    }
    return this.next(Promise.reject(err));
  };
  Repeater2.prototype[Symbol.asyncIterator] = function() {
    return this;
  };
  Repeater2.race = race;
  Repeater2.merge = merge;
  Repeater2.zip = zip;
  Repeater2.latest = latest;
  return Repeater2;
}();
function getIterators(values, options) {
  var e_3, _a;
  var iters = [];
  var _loop_1 = function(value2) {
    if (value2 != null && typeof value2[Symbol.asyncIterator] === "function") {
      iters.push(value2[Symbol.asyncIterator]());
    } else if (value2 != null && typeof value2[Symbol.iterator] === "function") {
      iters.push(value2[Symbol.iterator]());
    } else {
      iters.push(function valueToAsyncIterator() {
        return __asyncGenerator(this, arguments, function valueToAsyncIterator_1() {
          return __generator(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (!options.yieldValues)
                  return [3, 3];
                return [4, __await(value2)];
              case 1:
                return [4, _a2.sent()];
              case 2:
                _a2.sent();
                _a2.label = 3;
              case 3:
                if (!options.returnValues)
                  return [3, 5];
                return [4, __await(value2)];
              case 4:
                return [2, _a2.sent()];
              case 5:
                return [2];
            }
          });
        });
      }());
    }
  };
  try {
    for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
      var value = values_1_1.value;
      _loop_1(value);
    }
  } catch (e_3_1) {
    e_3 = { error: e_3_1 };
  } finally {
    try {
      if (values_1_1 && !values_1_1.done && (_a = values_1.return))
        _a.call(values_1);
    } finally {
      if (e_3)
        throw e_3.error;
    }
  }
  return iters;
}
function race(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { returnValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, stopped, finalIteration, iteration, i_1, _loop_2;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2];
            }
            stopped = false;
            stop2.then(function() {
              advance();
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 5, 7]);
            iteration = void 0;
            i_1 = 0;
            _loop_2 = function() {
              var j, iters_1, iters_1_1, iter;
              var e_4, _a2;
              return __generator(this, function(_b) {
                switch (_b.label) {
                  case 0:
                    j = i_1;
                    try {
                      for (iters_1 = (e_4 = void 0, __values(iters)), iters_1_1 = iters_1.next(); !iters_1_1.done; iters_1_1 = iters_1.next()) {
                        iter = iters_1_1.value;
                        Promise.resolve(iter.next()).then(function(iteration2) {
                          if (iteration2.done) {
                            stop2();
                            if (finalIteration === void 0) {
                              finalIteration = iteration2;
                            }
                          } else if (i_1 === j) {
                            i_1++;
                            advance(iteration2);
                          }
                        }, function(err) {
                          return stop2(err);
                        });
                      }
                    } catch (e_4_1) {
                      e_4 = { error: e_4_1 };
                    } finally {
                      try {
                        if (iters_1_1 && !iters_1_1.done && (_a2 = iters_1.return))
                          _a2.call(iters_1);
                      } finally {
                        if (e_4)
                          throw e_4.error;
                      }
                    }
                    return [4, new Promise(function(resolve) {
                      return advance = resolve;
                    })];
                  case 1:
                    iteration = _b.sent();
                    if (!(iteration !== void 0))
                      return [3, 3];
                    return [4, push2(iteration.value)];
                  case 2:
                    _b.sent();
                    _b.label = 3;
                  case 3:
                    return [2];
                }
              });
            };
            _a.label = 2;
          case 2:
            if (!!stopped)
              return [3, 4];
            return [5, _loop_2()];
          case 3:
            _a.sent();
            return [3, 2];
          case 4:
            return [2, finalIteration && finalIteration.value];
          case 5:
            stop2();
            return [4, Promise.race(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 6:
            _a.sent();
            return [7];
          case 7:
            return [2];
        }
      });
    });
  });
}
function merge(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { yieldValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advances, stopped, finalIteration;
      var _this2 = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2];
            }
            advances = [];
            stopped = false;
            stop2.then(function() {
              var e_5, _a2;
              stopped = true;
              try {
                for (var advances_1 = __values(advances), advances_1_1 = advances_1.next(); !advances_1_1.done; advances_1_1 = advances_1.next()) {
                  var advance = advances_1_1.value;
                  advance();
                }
              } catch (e_5_1) {
                e_5 = { error: e_5_1 };
              } finally {
                try {
                  if (advances_1_1 && !advances_1_1.done && (_a2 = advances_1.return))
                    _a2.call(advances_1);
                } finally {
                  if (e_5)
                    throw e_5.error;
                }
              }
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 3, 4]);
            return [4, Promise.all(iters.map(function(iter, i) {
              return __awaiter(_this2, void 0, void 0, function() {
                var iteration, _a2;
                return __generator(this, function(_b) {
                  switch (_b.label) {
                    case 0:
                      _b.trys.push([0, , 6, 9]);
                      _b.label = 1;
                    case 1:
                      if (!!stopped)
                        return [3, 5];
                      Promise.resolve(iter.next()).then(function(iteration2) {
                        return advances[i](iteration2);
                      }, function(err) {
                        return stop2(err);
                      });
                      return [4, new Promise(function(resolve) {
                        advances[i] = resolve;
                      })];
                    case 2:
                      iteration = _b.sent();
                      if (!(iteration !== void 0))
                        return [3, 4];
                      if (iteration.done) {
                        finalIteration = iteration;
                        return [2];
                      }
                      return [4, push2(iteration.value)];
                    case 3:
                      _b.sent();
                      _b.label = 4;
                    case 4:
                      return [3, 1];
                    case 5:
                      return [3, 9];
                    case 6:
                      _a2 = iter.return;
                      if (!_a2)
                        return [3, 8];
                      return [4, iter.return()];
                    case 7:
                      _a2 = _b.sent();
                      _b.label = 8;
                    case 8:
                      return [7];
                    case 9:
                      return [2];
                  }
                });
              });
            }))];
          case 2:
            _a.sent();
            return [2, finalIteration && finalIteration.value];
          case 3:
            stop2();
            return [7];
          case 4:
            return [2];
        }
      });
    });
  });
}
function zip(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { returnValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, stopped, iterations, values;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2, []];
            }
            stopped = false;
            stop2.then(function() {
              advance();
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 6, 8]);
            _a.label = 2;
          case 2:
            if (!!stopped)
              return [3, 5];
            Promise.all(iters.map(function(iter) {
              return iter.next();
            })).then(function(iterations2) {
              return advance(iterations2);
            }, function(err) {
              return stop2(err);
            });
            return [4, new Promise(function(resolve) {
              return advance = resolve;
            })];
          case 3:
            iterations = _a.sent();
            if (iterations === void 0) {
              return [2];
            }
            values = iterations.map(function(iteration) {
              return iteration.value;
            });
            if (iterations.some(function(iteration) {
              return iteration.done;
            })) {
              return [2, values];
            }
            return [4, push2(values)];
          case 4:
            _a.sent();
            return [3, 2];
          case 5:
            return [3, 8];
          case 6:
            stop2();
            return [4, Promise.all(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 7:
            _a.sent();
            return [7];
          case 8:
            return [2];
        }
      });
    });
  });
}
function latest(contenders) {
  var _this = this;
  var iters = getIterators(contenders, {
    yieldValues: true,
    returnValues: true
  });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, advances, stopped, iterations_1, values_2;
      var _this2 = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2, []];
            }
            advances = [];
            stopped = false;
            stop2.then(function() {
              var e_6, _a2;
              advance();
              try {
                for (var advances_2 = __values(advances), advances_2_1 = advances_2.next(); !advances_2_1.done; advances_2_1 = advances_2.next()) {
                  var advance1 = advances_2_1.value;
                  advance1();
                }
              } catch (e_6_1) {
                e_6 = { error: e_6_1 };
              } finally {
                try {
                  if (advances_2_1 && !advances_2_1.done && (_a2 = advances_2.return))
                    _a2.call(advances_2);
                } finally {
                  if (e_6)
                    throw e_6.error;
                }
              }
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 5, 7]);
            Promise.all(iters.map(function(iter) {
              return iter.next();
            })).then(function(iterations) {
              return advance(iterations);
            }, function(err) {
              return stop2(err);
            });
            return [4, new Promise(function(resolve) {
              return advance = resolve;
            })];
          case 2:
            iterations_1 = _a.sent();
            if (iterations_1 === void 0) {
              return [2];
            }
            values_2 = iterations_1.map(function(iteration) {
              return iteration.value;
            });
            if (iterations_1.every(function(iteration) {
              return iteration.done;
            })) {
              return [2, values_2];
            }
            return [4, push2(values_2.slice())];
          case 3:
            _a.sent();
            return [4, Promise.all(iters.map(function(iter, i) {
              return __awaiter(_this2, void 0, void 0, function() {
                var iteration;
                return __generator(this, function(_a2) {
                  switch (_a2.label) {
                    case 0:
                      if (iterations_1[i].done) {
                        return [2, iterations_1[i].value];
                      }
                      _a2.label = 1;
                    case 1:
                      if (!!stopped)
                        return [3, 4];
                      Promise.resolve(iter.next()).then(function(iteration2) {
                        return advances[i](iteration2);
                      }, function(err) {
                        return stop2(err);
                      });
                      return [4, new Promise(function(resolve) {
                        return advances[i] = resolve;
                      })];
                    case 2:
                      iteration = _a2.sent();
                      if (iteration === void 0) {
                        return [2, iterations_1[i].value];
                      } else if (iteration.done) {
                        return [2, iteration.value];
                      }
                      values_2[i] = iteration.value;
                      return [4, push2(values_2.slice())];
                    case 3:
                      _a2.sent();
                      return [3, 1];
                    case 4:
                      return [2];
                  }
                });
              });
            }))];
          case 4:
            return [2, _a.sent()];
          case 5:
            stop2();
            return [4, Promise.all(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 6:
            _a.sent();
            return [7];
          case 7:
            return [2];
        }
      });
    });
  });
}
class Config {
  constructor() {
    this._extraRequestThreshold = 256 * 1024;
  }
  extraRequestThreshold() {
    return this._extraRequestThreshold;
  }
  setExtraRequestThreshold(bytes) {
    if (bytes < 0) {
      throw new Error("extraRequestThreshold cannot be negative");
    }
    this._extraRequestThreshold = bytes;
  }
}
Config.global = new Config();
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["Debug"] = 0] = "Debug";
  LogLevel2[LogLevel2["Info"] = 1] = "Info";
  LogLevel2[LogLevel2["Warn"] = 2] = "Warn";
  LogLevel2[LogLevel2["Error"] = 3] = "Error";
})(LogLevel || (LogLevel = {}));
class Logger {
  static debug(...args) {
    this.log(LogLevel.Debug, ...args);
  }
  static info(...args) {
    this.log(LogLevel.Info, ...args);
  }
  static warn(...args) {
    this.log(LogLevel.Warn, ...args);
  }
  static error(...args) {
    this.log(LogLevel.Error, ...args);
  }
  static log(level, ...args) {
    if (this.logLevel > level) {
      return;
    }
    switch (level) {
      case LogLevel.Debug: {
        console.debug(...args);
        break;
      }
      case LogLevel.Info: {
        console.info(...args);
        break;
      }
      case LogLevel.Warn: {
        console.warn(...args);
        break;
      }
      case LogLevel.Error: {
        console.error(...args);
        break;
      }
    }
  }
}
Logger.logLevel = LogLevel.Info;
const NODE_ITEM_LEN = 8 * 4 + 8;
const DEFAULT_NODE_SIZE = 16;
function calcTreeSize(numItems, nodeSize) {
  nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
  let n = numItems;
  let numNodes = n;
  do {
    n = Math.ceil(n / nodeSize);
    numNodes += n;
  } while (n !== 1);
  return numNodes * NODE_ITEM_LEN;
}
function generateLevelBounds(numItems, nodeSize) {
  if (nodeSize < 2)
    throw new Error("Node size must be at least 2");
  if (numItems === 0)
    throw new Error("Number of items must be greater than 0");
  let n = numItems;
  let numNodes = n;
  const levelNumNodes = [n];
  do {
    n = Math.ceil(n / nodeSize);
    numNodes += n;
    levelNumNodes.push(n);
  } while (n !== 1);
  const levelOffsets = [];
  n = numNodes;
  for (const size of levelNumNodes) {
    levelOffsets.push(n - size);
    n -= size;
  }
  levelOffsets.reverse();
  levelNumNodes.reverse();
  const levelBounds = [];
  for (let i = 0; i < levelNumNodes.length; i++)
    levelBounds.push([levelOffsets[i], levelOffsets[i] + levelNumNodes[i]]);
  levelBounds.reverse();
  return levelBounds;
}
async function* streamSearch(numItems, nodeSize, rect, readNode) {
  class NodeRange {
    constructor(nodes, level) {
      this._level = level;
      this.nodes = nodes;
    }
    level() {
      return this._level;
    }
    startNode() {
      return this.nodes[0];
    }
    endNode() {
      return this.nodes[1];
    }
    extendEndNodeToNewOffset(newOffset) {
      console.assert(newOffset > this.nodes[1]);
      this.nodes[1] = newOffset;
    }
    toString() {
      return `[NodeRange level: ${this._level}, nodes: ${this.nodes[0]}-${this.nodes[1]}]`;
    }
  }
  const { minX, minY, maxX, maxY } = rect;
  Logger.info(`tree items: ${numItems}, nodeSize: ${nodeSize}`);
  const levelBounds = generateLevelBounds(numItems, nodeSize);
  const leafNodesOffset = levelBounds[0][0];
  const rootNodeRange = (() => {
    const range = [0, 1];
    const level = levelBounds.length - 1;
    return new NodeRange(range, level);
  })();
  const queue = [rootNodeRange];
  Logger.debug(`starting stream search with queue: ${queue}, numItems: ${numItems}, nodeSize: ${nodeSize}, levelBounds: ${levelBounds}`);
  while (queue.length != 0) {
    const nodeRange = queue.shift();
    Logger.debug(`popped node: ${nodeRange}, queueLength: ${queue.length}`);
    const nodeIndex = nodeRange.startNode();
    const isLeafNode = nodeIndex >= leafNodesOffset;
    const [, levelBound] = levelBounds[nodeRange.level()];
    const end = Math.min(nodeRange.endNode() + nodeSize, levelBound);
    const length = end - nodeIndex;
    const buffer = await readNode(nodeIndex * NODE_ITEM_LEN, length * NODE_ITEM_LEN);
    const float64Array = new Float64Array(buffer);
    const uint32Array = new Uint32Array(buffer);
    for (let pos = nodeIndex; pos < end; pos++) {
      const nodePos = (pos - nodeIndex) * 5;
      if (maxX < float64Array[nodePos + 0])
        continue;
      if (maxY < float64Array[nodePos + 1])
        continue;
      if (minX > float64Array[nodePos + 2])
        continue;
      if (minY > float64Array[nodePos + 3])
        continue;
      const low32Offset = uint32Array[(nodePos << 1) + 8];
      const high32Offset = uint32Array[(nodePos << 1) + 9];
      const offset = readUint52(high32Offset, low32Offset);
      if (isLeafNode) {
        const featureLength = (() => {
          if (pos < numItems - 1) {
            const nextPos = (pos - nodeIndex + 1) * 5;
            const low32Offset2 = uint32Array[(nextPos << 1) + 8];
            const high32Offset2 = uint32Array[(nextPos << 1) + 9];
            const nextOffset = readUint52(high32Offset2, low32Offset2);
            return nextOffset - offset;
          } else {
            return null;
          }
        })();
        yield [offset, pos - leafNodesOffset, featureLength];
        continue;
      }
      const extraRequestThresholdNodes = Config.global.extraRequestThreshold() / NODE_ITEM_LEN;
      const nearestNodeRange = queue[queue.length - 1];
      if (nearestNodeRange !== void 0 && nearestNodeRange.level() == nodeRange.level() - 1 && offset < nearestNodeRange.endNode() + extraRequestThresholdNodes) {
        Logger.debug(`Merging "nodeRange" request into existing range: ${nearestNodeRange}, newOffset: ${nearestNodeRange.endNode()} -> ${offset}`);
        nearestNodeRange.extendEndNodeToNewOffset(offset);
        continue;
      }
      const newNodeRange = (() => {
        const level = nodeRange.level() - 1;
        const range = [offset, offset + 1];
        return new NodeRange(range, level);
      })();
      if (nearestNodeRange !== void 0 && nearestNodeRange.level() == newNodeRange.level()) {
        Logger.info(`Same level, but too far away. Pushing new request at offset: ${offset} rather than merging with distant ${nearestNodeRange}`);
      } else {
        Logger.info(`Pushing new level for ${newNodeRange} onto queue with nearestNodeRange: ${nearestNodeRange} since there's not already a range for this level.`);
      }
      queue.push(newNodeRange);
    }
  }
}
function readUint52(high32Bits, low32Bits) {
  if ((high32Bits & 4293918720) != 0) {
    throw Error("integer is too large to be safely represented");
  }
  const result = low32Bits + high32Bits * 2 ** 32;
  return result;
}
const magicbytes = new Uint8Array([
  102,
  103,
  98,
  3,
  102,
  103,
  98,
  0
]);
const SIZE_PREFIX_LEN = 4;
class HttpReader {
  constructor(headerClient, header, headerLength, indexLength) {
    this.headerClient = headerClient;
    this.header = header;
    this.headerLength = headerLength;
    this.indexLength = indexLength;
  }
  static async open(url) {
    const assumedHeaderLength = 2024;
    const headerClient = new BufferedHttpRangeClient(url);
    const assumedIndexLength = (() => {
      const assumedBranchingFactor = DEFAULT_NODE_SIZE;
      const prefetchedLayers = 3;
      let result = 0;
      let i;
      for (i = 0; i < prefetchedLayers; i++) {
        const layer_width = assumedBranchingFactor ** i * NODE_ITEM_LEN;
        result += layer_width;
      }
      return result;
    })();
    const minReqLength = assumedHeaderLength + assumedIndexLength;
    Logger.debug(`fetching header. minReqLength: ${minReqLength} (assumedHeaderLength: ${assumedHeaderLength}, assumedIndexLength: ${assumedIndexLength})`);
    {
      const bytes2 = new Uint8Array(await headerClient.getRange(0, 8, minReqLength, "header"));
      if (!bytes2.every((v, i) => magicbytes[i] === v)) {
        Logger.error(`bytes: ${bytes2} != ${magicbytes}`);
        throw new Error("Not a FlatGeobuf file");
      }
      Logger.debug("magic bytes look good");
    }
    let headerLength;
    {
      const bytes2 = await headerClient.getRange(8, 4, minReqLength, "header");
      headerLength = new DataView(bytes2).getUint32(0, true);
      const HEADER_MAX_BUFFER_SIZE = 1048576 * 10;
      if (headerLength > HEADER_MAX_BUFFER_SIZE || headerLength < 8) {
        throw new Error("Invalid header size");
      }
      Logger.debug(`headerLength: ${headerLength}`);
    }
    const bytes = await headerClient.getRange(12, headerLength, minReqLength, "header");
    const bb = new ByteBuffer(new Uint8Array(bytes));
    const header = HeaderMeta.fromByteBuffer(bb);
    const indexLength = calcTreeSize(header.featuresCount, header.indexNodeSize);
    Logger.debug("completed: opening http reader");
    return new HttpReader(headerClient, header, headerLength, indexLength);
  }
  async *selectBbox(rect) {
    const lengthBeforeTree = this.lengthBeforeTree();
    const bufferedClient = this.headerClient;
    const readNode = async function(offsetIntoTree, size) {
      const minReqLength = 0;
      return bufferedClient.getRange(lengthBeforeTree + offsetIntoTree, size, minReqLength, "index");
    };
    const batches = [];
    let currentBatch = [];
    for await (const searchResult of streamSearch(this.header.featuresCount, this.header.indexNodeSize, rect, readNode)) {
      const [featureOffset, ,] = searchResult;
      let [, , featureLength] = searchResult;
      if (!featureLength) {
        Logger.info("final feature");
        const guessLength = Config.global.extraRequestThreshold();
        featureLength = guessLength;
      }
      if (currentBatch.length == 0) {
        currentBatch.push([featureOffset, featureLength]);
        continue;
      }
      const prevFeature = currentBatch[currentBatch.length - 1];
      const gap = featureOffset - (prevFeature[0] + prevFeature[1]);
      if (gap > Config.global.extraRequestThreshold()) {
        Logger.info(`Pushing new feature batch, since gap ${gap} was too large`);
        batches.push(currentBatch);
        currentBatch = [];
      }
      currentBatch.push([featureOffset, featureLength]);
    }
    this.headerClient.logUsage("header+index");
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }
    const promises = batches.flatMap((batch) => this.readFeatureBatch(batch));
    yield* Repeater.merge(promises);
  }
  lengthBeforeTree() {
    return magicbytes.length + SIZE_PREFIX_LEN + this.headerLength;
  }
  lengthBeforeFeatures() {
    return this.lengthBeforeTree() + this.indexLength;
  }
  buildFeatureClient() {
    return new BufferedHttpRangeClient(this.headerClient.httpClient);
  }
  async *readFeatureBatch(batch) {
    const [firstFeatureOffset] = batch[0];
    const [lastFeatureOffset, lastFeatureLength] = batch[batch.length - 1];
    const batchStart = firstFeatureOffset;
    const batchEnd = lastFeatureOffset + lastFeatureLength;
    const batchSize = batchEnd - batchStart;
    const featureClient = this.buildFeatureClient();
    for (const [featureOffset] of batch) {
      yield await this.readFeature(featureClient, featureOffset, batchSize);
    }
    featureClient.logUsage("feature");
  }
  async readFeature(featureClient, featureOffset, minFeatureReqLength) {
    const offset = featureOffset + this.lengthBeforeFeatures();
    let featureLength;
    {
      const bytes2 = await featureClient.getRange(offset, 4, minFeatureReqLength, "feature length");
      featureLength = new DataView(bytes2).getUint32(0, true);
    }
    const byteBuffer = await featureClient.getRange(offset + 4, featureLength, minFeatureReqLength, "feature data");
    const bytes = new Uint8Array(byteBuffer);
    const bytesAligned = new Uint8Array(featureLength + SIZE_PREFIX_LEN);
    bytesAligned.set(bytes, SIZE_PREFIX_LEN);
    const bb = new ByteBuffer(bytesAligned);
    bb.setPosition(SIZE_PREFIX_LEN);
    return Feature.getRootAsFeature(bb);
  }
}
class BufferedHttpRangeClient {
  constructor(source) {
    this.bytesEverUsed = 0;
    this.bytesEverFetched = 0;
    this.buffer = new ArrayBuffer(0);
    this.head = 0;
    if (typeof source === "string") {
      this.httpClient = new HttpRangeClient(source);
    } else {
      this.httpClient = source;
    }
  }
  async getRange(start, length, minReqLength, purpose) {
    this.bytesEverUsed += length;
    const start_i = start - this.head;
    const end_i = start_i + length;
    if (start_i >= 0 && end_i <= this.buffer.byteLength) {
      return this.buffer.slice(start_i, end_i);
    }
    const lengthToFetch = Math.max(length, minReqLength);
    this.bytesEverFetched += lengthToFetch;
    Logger.debug(`requesting for new Range: ${start}-${start + length - 1}`);
    this.buffer = await this.httpClient.getRange(start, lengthToFetch, purpose);
    this.head = start;
    return this.buffer.slice(0, length);
  }
  logUsage(purpose) {
    const category = purpose.split(" ")[0];
    const used = this.bytesEverUsed;
    const requested = this.bytesEverFetched;
    const efficiency = (100 * used / requested).toFixed(2);
    Logger.info(`${category} bytes used/requested: ${used} / ${requested} = ${efficiency}%`);
  }
}
class HttpRangeClient {
  constructor(url) {
    this.requestsEverMade = 0;
    this.bytesEverRequested = 0;
    this.url = url;
  }
  async getRange(begin, length, purpose) {
    this.requestsEverMade += 1;
    this.bytesEverRequested += length;
    const range = `bytes=${begin}-${begin + length - 1}`;
    Logger.info(`request: #${this.requestsEverMade}, purpose: ${purpose}), bytes: (this_request: ${length}, ever: ${this.bytesEverRequested}), Range: ${range}`);
    const response = await fetch(this.url, {
      headers: {
        Range: range
      }
    });
    return response.arrayBuffer();
  }
}
function deserialize$2(bytes, fromFeature2, headerMetaFn) {
  if (!bytes.subarray(0, 7).every((v, i) => magicbytes[i] === v))
    throw new Error("Not a FlatGeobuf file");
  const bb = new ByteBuffer(bytes);
  const headerLength = bb.readUint32(magicbytes.length);
  bb.setPosition(magicbytes.length + SIZE_PREFIX_LEN);
  const headerMeta = HeaderMeta.fromByteBuffer(bb);
  if (headerMetaFn)
    headerMetaFn(headerMeta);
  let offset = magicbytes.length + SIZE_PREFIX_LEN + headerLength;
  const { indexNodeSize, featuresCount } = headerMeta;
  if (indexNodeSize > 0)
    offset += calcTreeSize(featuresCount, indexNodeSize);
  const features = [];
  while (offset < bb.capacity()) {
    const featureLength = bb.readUint32(offset);
    bb.setPosition(offset + SIZE_PREFIX_LEN);
    const feature = Feature.getRootAsFeature(bb);
    features.push(fromFeature2(feature, headerMeta));
    offset += SIZE_PREFIX_LEN + featureLength;
  }
  return features;
}
async function* deserializeStream$1(stream, fromFeature2, headerMetaFn) {
  const reader = slice(stream);
  const read = async (size) => await reader.slice(size);
  let bytes = new Uint8Array(await read(8));
  if (!bytes.every((v, i) => magicbytes[i] === v))
    throw new Error("Not a FlatGeobuf file");
  bytes = new Uint8Array(await read(4));
  let bb = new ByteBuffer(bytes);
  const headerLength = bb.readUint32(0);
  bytes = new Uint8Array(await read(headerLength));
  bb = new ByteBuffer(bytes);
  const headerMeta = HeaderMeta.fromByteBuffer(bb);
  if (headerMetaFn)
    headerMetaFn(headerMeta);
  const { indexNodeSize, featuresCount } = headerMeta;
  if (indexNodeSize > 0) {
    const treeSize = calcTreeSize(featuresCount, indexNodeSize);
    await read(treeSize);
  }
  let feature;
  while (feature = await readFeature(read, headerMeta, fromFeature2))
    yield feature;
}
async function* deserializeFiltered$1(url, rect, fromFeature2, headerMetaFn) {
  const reader = await HttpReader.open(url);
  Logger.debug("opened reader");
  if (headerMetaFn)
    headerMetaFn(reader.header);
  for await (const feature of reader.selectBbox(rect)) {
    yield fromFeature2(feature, reader.header);
  }
}
async function readFeature(read, headerMeta, fromFeature2) {
  let bytes = new Uint8Array(await read(4, "feature length"));
  if (bytes.byteLength === 0)
    return;
  let bb = new ByteBuffer(bytes);
  const featureLength = bb.readUint32(0);
  bytes = new Uint8Array(await read(featureLength, "feature data"));
  const bytesAligned = new Uint8Array(featureLength + 4);
  bytesAligned.set(bytes, 4);
  bb = new ByteBuffer(bytesAligned);
  bb.setPosition(SIZE_PREFIX_LEN);
  const feature = Feature.getRootAsFeature(bb);
  return fromFeature2(feature, headerMeta);
}
function deserialize$1(bytes, headerMetaFn) {
  const features = deserialize$2(bytes, fromFeature, headerMetaFn);
  return {
    type: "FeatureCollection",
    features
  };
}
function deserializeStream(stream, headerMetaFn) {
  return deserializeStream$1(stream, fromFeature, headerMetaFn);
}
function deserializeFiltered(url, rect, headerMetaFn) {
  return deserializeFiltered$1(url, rect, fromFeature, headerMetaFn);
}
function deserialize(input, rect, headerMetaFn) {
  if (input instanceof Uint8Array)
    return deserialize$1(input, headerMetaFn);
  else if (input instanceof ReadableStream)
    return deserializeStream(input, headerMetaFn);
  else
    return deserializeFiltered(input, rect, headerMetaFn);
}
const getSourceTypeFGB = (map) => class FlatgeobufSource extends getGeoJSONSource(map) {
  constructor(id, _a, dispatcher, eventedParent) {
    var _b = _a, { data } = _b, options = __objRest(_b, ["data"]);
    super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
    this.id = id;
    this.type = "geojson";
    this._options.data = data;
    if (options.fgbFilter)
      this.setFGBFilter(options.fgbFilter);
    else
      this.setData(data);
  }
  setData(data) {
    if (this._options.fgbFilter || data instanceof ReadableStream || data instanceof Uint8Array) {
      let fc = emptyGeoJSON;
      let progressiv = this._options.fgbProgressiv;
      let filter = this._options.fgbFilter;
      let featureCount = 0;
      (async () => {
        for await (let feature of deserialize(data, filter, (meta) => {
          if (progressiv > 0 && progressiv < 1)
            progressiv = Math.ceil(meta.featuresCount * progressiv);
        })) {
          fc.features.push(feature);
          if (progressiv && !(++featureCount % progressiv)) {
            super.setData(fc);
          }
        }
        super.setData(fc);
      })();
    } else if (typeof data === "string" || data instanceof String) {
      this._options.data = data;
      (async () => {
        const response = await fetch(data);
        this.setData(response.body);
      })();
    } else {
      console.error("FlatgeobufSource expects a URL, a ReadableStream or a Uint8Array as 'data'");
    }
    return this;
  }
  setFGBFilter(filter) {
    if (filter.toArray) {
      return this.setFGBFilter(filter.toArray());
    } else if (Array.isArray(filter)) {
      let coo = filter.reduce((re, co) => {
        re.x.push(co[0]);
        re.y.push(co[1]);
        return re;
      }, { x: [], y: [] });
      return this.setFGBFilter({
        minX: Math.min.apply(null, coo.x),
        minY: Math.min.apply(null, coo.y),
        maxX: Math.max.apply(null, coo.x),
        maxY: Math.max.apply(null, coo.y)
      });
    } else {
      this._options.fgbFilter = filter;
      this.setData(this._options.data);
    }
    return this;
  }
};
const addSourceTypeFGB = function(map, cb) {
  map.addSourceType("flatgeobuf", getSourceTypeFGB(map), cb);
};
export { addSourceTypeFGB, addSourceTypeFGB as default, getSourceTypeFGB };
