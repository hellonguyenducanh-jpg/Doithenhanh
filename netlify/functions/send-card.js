const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event) => {
    // Chỉ chấp nhận gửi thẻ qua phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { pin, seri, type, amount } = JSON.parse(event.body);

        // --- THÔNG TIN TÀI KHOẢN CỦA HOÀNG LAN ANH ---
        const partner_id = '85444445623'; 
        const partner_key = '0d6f6428c3948c84e3d5a1e0c086ffba'; 
        // ---------------------------------------------

        // Tạo mã chữ ký bảo mật MD5 theo đúng chuẩn doithe1s
        const sign = crypto.createHash('md5').update(partner_key + pin + seri).digest('hex');

        // Gửi dữ liệu thẻ sang hệ thống doithe1s.vn
        const response = await axios.post('https://doithe1s.vn/api/card-auto', new URLSearchParams({
            type: type,          // Loại thẻ (VIETTEL, VINA...)
            amount: amount,      // Mệnh giá khách chọn
            serial: seri,        // Số seri
            pin: pin,            // Mã thẻ
            partner_id: partner_id,
            request_id: Math.floor(Math.random() * 100000000).toString(),
            sign: sign
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Trả kết quả xử lý về cho giao diện web
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        console.error("Lỗi gửi thẻ:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 0, message: "Lỗi kết nối Server API" })
        };
    }
};
