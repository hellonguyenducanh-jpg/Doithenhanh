const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event) => {
    // Chỉ nhận dữ liệu qua POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Chỉ chấp nhận POST" };
    }

    try {
        const data = JSON.parse(event.body);
        
        // THÔNG TIN TÀI KHOẢN CỦA BẠN (ĐÃ KIỂM TRA CHÍNH XÁC)
        const partner_id = '85444445623'; 
        const partner_key = '0d6f6428c3948c84e3d5a1e0c086ffba'; 

        // Tạo chữ ký bảo mật MD5
        const sign = crypto.createHash('md5').update(partner_key + data.pin + data.seri).digest('hex');

        // Gửi dữ liệu nạp thẻ sang doithe1s.vn
        const response = await axios({
            method: 'post',
            url: 'https://doithe1s.vn/api/card-auto',
            data: new URLSearchParams({
                type: data.type,
                amount: data.amount,
                serial: data.seri,
                pin: data.pin,
                partner_id: partner_id,
                request_id: Date.now().toString(),
                sign: sign
            }).toString(),
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
            body: JSON.stringify({ status: 0, message: "Lỗi hệ thống Netlify: " + error.message })
        };
    }
};
