import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { get, post } from "../../../utils/request";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

function CreateKoi() {
  const [form] = Form.useForm();
  const [varieties, setVarieties] = useState([]);
  const [farm, setFarm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const disableFutureDates = (current) => {
    return current && current > moment().endOf("year");
  };
  useEffect(() => {
    const fetchApi = async () => {
      const response = await get("koi-variable/view-all");
      if (response) {
        const formattedVarieties = response.map((item) => ({
          label: item.varietyName,
          value: item.varietyId,
        }));
        setVarieties(formattedVarieties);
      }
    };
    fetchApi();
  }, []);
  useEffect(() => {
    const fetchApi = async () => {
      const response = await get("koiFarm/view-all");
      if (response) {
        const formattedFarm = response.map((item) => ({
          label: item.farmName,
          value: item.farmId,
        }));
        setFarm(formattedFarm);
      }
    };
    fetchApi();
  }, []);
  const handleFinish = async (values) => {
    try {
      setLoading(true);
      if (fileList.length === 0) {
        messageApi.error("Yêu cầu thêm hình ảnh");
        setLoading(false);
        return;
      }

      const allKoi = await get("koi/view-all");
      const isDuplicate = allKoi.some(
        (koi) => koi.koiName === values.koiName.trim()
      );
      if (isDuplicate) {
        messageApi.error("Tên cá Koi đã tồn tại, vui lòng chọn tên khác.");
        setLoading(false);
        return;
      }
      const farmId = values.farmId;
      const varietyIds = values.varietyId;
      const getTimeCurrent = () => {
        return new Date().toLocaleString();
      };

      const koiResponse = await post(`koi/create/${farmId}`, {
        ...values,
        varietyId: undefined,
        updateDate: getTimeCurrent(),
      });
      if (koiResponse) {
        const koiId = koiResponse.koiId;
        const varietyPromises = varietyIds.map((varietyId) =>
          post(`varietyOfKoi/create/${koiId}&${varietyId}`, null)
        );

        if (fileList.length > 0) {
          await uploadImages(koiId, fileList);
          form.resetFields();
          setFileList([]);
          messageApi.success("Thêm cá koi mới thành công");
        }
        await Promise.all(varietyPromises);
      } else {
        messageApi.error("Thêm cá mới không thành công");
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Lỗi");
    } finally {
      setLoading(false);
    }
  };
  const uploadImages = async (koiId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}koi-image/upload/${koiId}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      console.log(response);
      if (!response) {
        throw new Error("Lỗi tải lên hình ảnh");
      }

      const data = await response.json();
      return data.urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error("Lỗi tải lên hình ảnh");
      throw error;
    }
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <>
      {contextHolder}
      <h1>Thêm cá koi mới</h1>
      <Form onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item
              label="Tên cá koi"
              name="koiName"
              rules={[{ required: true, message: "Vui lòng nhập tên cá koi!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Độ dài (cm)"
              name="length"
              rules={[
                { required: true, message: "Vui lòng nhập độ dài!" },
                {
                  required: true,
                  pattern: /^[1-9]\d*$/,
                  message: "Độ dài cá koi lớn hơn 0 và là chữ số",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá tiền!" },
                {
                  required: true,
                  pattern: /^[1-9]\d*$/,
                  message: "Giá cá koi phải lớn hơn 0",
                },
              ]}
            >
              <Input addonAfter="đ" type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Năm" name="yob" rules={[{ required: true, message: 'Vui lòng nhập năm sinh!' }, {
              validator: (_, value) => {
                const currentYear = new Date().getFullYear();
                if (value && value > 2000 && value <= currentYear) {
                  return Promise.resolve();
                }
                return Promise.reject('Năm sinh phải lớn hơn 2000 và nhỏ hơn hoặc bằng năm hiện tại');
              },
            },]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select>
                <Option value="Koi Đực">Đực</Option>
                <Option value="Koi Cái">Cái</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Trang trại"
              name="farmId"
              rules={[{ required: true, message: "Vui lòng chọn trang trại!" }]}
            >
              <Select options={farm} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Giống cá"
              name="varietyId"
              rules={[{ required: true, message: "Vui lòng chọn giống cá!" }]}
            >
              <Select mode="multiple" options={varieties} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" },
              {
                required: true,
                pattern: /^[1-9]\d*$/,
                message: 'Số lượng cá phải lớn hơn 0'
              }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Hình ảnh" name="images" rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả" name="description">
              <TextArea rows={16} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo mới
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
export default CreateKoi;
