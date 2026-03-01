const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { pin, seri, type, amount } = JSON.parse(event.body);

        // THÔNG TIN TÀI KHOẢN CỦA BẠN (ĐÃ ĐIỀN CHÍNH XÁC)
        const partner_id = '85444445623'; 
        const partner_key = '0d6f6428c3948c84e3d5a1e0c086ffba'; 

        // Tạo chữ ký bảo mật MD5 theo yêu cầu của doithe1s
        const sign = crypto.createHash('md5').update(partner_key + pin + seri).digest('hex');

        // Gửi lệnh nạp thẻ sang API doithe1s.vn
        const response = await axios.post('https://doithe1s.vn/api/card-auto', new URLSearchParams({
            type: type,
            amount: amount,
            serial: seri,
            pin: pin,
            partner_id: partner_id,
            request_id: Date.now().toString(), // Tạo mã đơn hàng duy nhất bằng thời gian
            sign: sign
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 0, message: "Lỗi kết nối Server API" })
        };
    }
};
