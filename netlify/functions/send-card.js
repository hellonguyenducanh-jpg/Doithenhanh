const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // Chỉ cho phép phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { pin, seri, type, amount } = JSON.parse(event.body);

        // --- THÔNG TIN CẤU HÌNH CỦA BẠN ---
        const partner_id = '85444445623'; 
        const partner_key = 'DÁN_MÃ_PARTNER_KEY_CỦA_BẠN_VÀO_ĐÂY'; // Lấy ở chỗ dấu sao trong ảnh bạn gửi
        // ----------------------------------

        // Tạo chữ ký MD5 theo đúng yêu cầu của doithe1s: md5(partner_key + pin + serial)
        const sign = crypto.createHash('md5').update(partner_key + pin + seri).digest('hex');

        // Gửi dữ liệu sang API của doithe1s.vn
        const response = await axios.post('https://doithe1s.vn/api/card-auto', new URLSearchParams({
            type: type,
            amount: amount,
            serial: seri,
            pin: pin,
            partner_id: partner_id,
            request_id: Math.floor(Math.random() * 100000000).toString(),
            sign: sign
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Trả kết quả về cho giao diện web (index.html)
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 0, message: "Lỗi kết nối hệ thống API" })
        };
    }
};
