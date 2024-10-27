import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography } from "antd";
import "./Koi.scss";
import { get } from "../../utils/request";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

function Koi() {
  const [koi, setKoi] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await get("koi/view-all");
        const updatedKoiData = await Promise.all(
          response.map(async (koi) => {
            const farmResponse = await get(`koiFarm/view/${koi.farmId}`);
            return { ...koi, farmName: farmResponse.farmName };
          })
        );
        setKoi(updatedKoiData);
      } catch (error) {
        console.error("Error fetching Koi:", error);
      }
    };

    fetchAPI();
  }, []);
  return (
    <Row gutter={[16, 16]} className="koi-container">
      {koi.map((koi) => (
        <Col xs={24} sm={12} md={8} key={koi.koiId}>
          <Link
            to={`/kois/${koi.koiId}`}
            key={koi.koiName}
            className="koi-link"
          >
            <Card hoverable className="koi-card">
              <img
                key={koi.koiImageId}
                width={135}
                height={200}
                alt={koi?.koiName}
                src={`${process.env.REACT_APP_API_URL_UPLOAD}koi/${koi.koiImages[0].urlImage}`}
                alt={koi?.koiName || "Default Alt Text"}
                src={
                  koi?.koiImages?.[0]?.urlImage
                    ? `${process.env.REACT_APP_API_URL_UPLOAD}koi/${koi.koiImages[0].urlImage}`
                    : "path/to/default/image.jpg"
                }
                className="koi-image"
              />

              <Title level={4}>Tên cá koi: {koi.koiName}</Title>
              <Title level={5}>Giá: {koi.price}</Title>
              <Title level={5}>Ngày sinh: {koi.yob}</Title>
              <Title level={5}>Giới tính: {koi.gender}</Title>
              <Title level={5}>
                Ngày đăng: {dayjs(koi.updateDate).format("DD-MM-YYYY")}
              </Title>
              <Title level={5}>Trang trại: {koi.farmName}</Title>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default Koi;
