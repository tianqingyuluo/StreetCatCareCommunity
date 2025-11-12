package com.streetCat.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKBReader;
import org.locationtech.jts.io.ParseException;

import java.sql.*;

/**
 * MyBatis 类型处理器：Java org.locationtech.jts.geom.Point  ↔  MySQL POINT(SRID 4326)
 * 写入：WKT 字符串  →  ST_GeomFromText
 * 读出：WKB 字节数组 →  JTS Point
 */
@MappedTypes(Point.class)
@MappedJdbcTypes(JdbcType.OTHER)
public class MySqlPointTypeHandler extends BaseTypeHandler<Point> {

    /* 写入 -------------------------------------------------------------------- */
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Point point, JdbcType jdbcType) throws SQLException {
        // MySQL 8 空间函数语法
        String wkt = "POINT(" + point.getX() + " " + point.getY() + ")";
        // 用 ST_GeomFromText 把 WKT 转成几何对象，SRID 4326
        ps.setObject(i, wkt);
    }

    /* 读取 -------------------------------------------------------------------- */
    @Override
    public Point getNullableResult(ResultSet rs, String columnName) throws SQLException {
        byte[] wkb = rs.getBytes(columnName);
        return wkb == null ? null : parse(wkb);
    }

    @Override
    public Point getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        byte[] wkb = rs.getBytes(columnIndex);
        return wkb == null ? null : parse(wkb);
    }

    @Override
    public Point getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        byte[] wkb = cs.getBytes(columnIndex);
        return wkb == null ? null : parse(wkb);
    }

    /* 工具方法 --------------------------------------------------------------- */
    private Point parse(byte[] wkb) {
        try {
            return (Point) new WKBReader().read(wkb);
        } catch (ParseException e) {
            throw new RuntimeException("无法解析 WKB 为 JTS Point", e);
        }
    }
}