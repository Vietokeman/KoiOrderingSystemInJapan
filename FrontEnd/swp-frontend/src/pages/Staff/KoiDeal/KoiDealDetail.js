import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, put } from "../../../utils/request";
import GoBack from "../../../components/GoBack";
import { Button, Card, Input, List, Modal } from "antd";
import Swal from "sweetalert2";

function KoiDealDetail() {
      const params = useParams();
      const [koiBill, setKoiBill] = useState([]);
      const [modalVisible, setModalVisible] = useState(false);
      const [currentKoi, setCurrentKoi] = useState(null);
      const [newPrice, setNewPrice] = useState('');
      const [error, setError] = useState('');

      useEffect(() => {
            const fetchApi = async () => {
                  const response = await get(`koi-bill/view-by-billId/${params.id}`);
                  if (response) {
                        setKoiBill(response);
                  }
            }
            fetchApi();
      }, [params.id]);

      const showModal = (koi) => {
            setCurrentKoi(koi);
            setNewPrice(koi.originalPrice);
            setModalVisible(true);
      };

      const handleOk = async () => {
            if (currentKoi && newPrice) {
                  const data = {
                        "originalPrice": currentKoi.originalPrice,
                        "quantity": currentKoi.quantity,
                        "finalPrice": newPrice
                  }
                  try {
                        const response = await put(`koi-bill/update/${params.id}-${currentKoi.koiId}`, data)
                        if (response) {
                              setKoiBill(koiBill.map(koi =>
                                    koi.koiId === currentKoi.koiId ? { ...koi, finalPrice: parseFloat(newPrice) } : koi
                              ));
                              Swal.fire({
                                    icon: "success",
                                    title: "Nhập giá thành công!!!",
                              });
                        }
                  } catch (error) {
                        console.error('Error updating price:', error);
                  }
            }
            setModalVisible(false);
      };

      const handleCancel = () => {
            setModalVisible(false);
      };
      const handleConfirm = async (item) => {
            const data = {
                  "originalPrice": item.originalPrice,
                  "quantity": item.quantity,
                  "finalPrice": item.originalPrice
            }
            try {
                  const response = await put(`koi-bill/update/${params.id}-${item.koiId}`, data)
                  if (response) {
                        setKoiBill(koiBill.map(koi =>
                              koi.koiId === item.koiId ? { ...koi, finalPrice: item.originalPrice } : koi
                        ));
                        Swal.fire({
                              icon: "success",
                              title: "Xác nhận giá!!!",
                        });
                  }
            } catch (error) {
                  console.error('Error updating price:', error);
            }
      }
      const handleChange = (e) => {
            const value= e.target.value;
            if(value <= 0){
                  setError("Giá nhập vào phải lớn hơn 0");
            }else{
                  setError('');
            }
            setNewPrice(value);
      }
      return (
            <>
                  <GoBack />
                  <Card>
                        <List
                              dataSource={koiBill}
                              renderItem={(item) => (
                                    <List.Item>
                                          <div>
                                                <h3>Koi {item.koiName}</h3>
                                                <p>Số lượng: <strong>{item.quantity}</strong></p>
                                                <p>Giá tiền gốc: <strong>{item.originalPrice.toLocaleString()} đ</strong></p>
                                                <p>Giá tiền chốt: <strong>{item.finalPrice.toLocaleString()} đ</strong></p>
                                                {
                                                      item.finalPrice === 0 && (
                                                            <Button type="primary" onClick={() => handleConfirm(item)} className="mr-10">Xác nhận</Button>
                                                      )
                                                }
                                                <Button onClick={() => showModal(item)}>Cập nhật giá</Button>
                                          </div>
                                    </List.Item>
                              )}
                        />
                  </Card>
                  <Modal
                        title="Cập nhật giá"
                        visible={modalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                  >
                        {currentKoi && (
                              <>
                                    <p>Koi: {currentKoi.koiName}</p>
                                    <p>Giá hiện tại: {currentKoi.originalPrice.toLocaleString()} đ</p>
                                    <p>Nhập giá mới: </p>
                                    <Input
                                          type="number"
                                          value={newPrice}
                                          onChange={handleChange}
                                          placeholder="Nhập giá mới"
                                          
                                    />
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                              </>
                        )}
                  </Modal>
            </>
      );
};

export default KoiDealDetail;