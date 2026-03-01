const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event) => {
    // Chỉ cho phép gửi dữ liệu bằng phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        
        // THÔNG TIN TÀI KHOẢN CỦA BẠN
        const partner_id = '85444445623'; 
        const partner_key = '0d6f6428c3948c84e3d5a1e0c086ffba'; 

        // Tạo chữ ký MD5 bảo mật
        const sign = crypto.createHash('md5').update(partner_key + data.pin + data.seri).digest('hex');

        // --- ĐÂY LÀ PHẦN 1 BẠN HỎI (ĐÃ ĐƯỢC CHỈNH SỬA CHUẨN) ---
        const response = await axios.post('https://doithe1s.vn/api/card-auto', new URLSearchParams({
            type: data.type,
            amount: data.amount,
            serial: data.seri,
            pin: data.pin,
            partner_id: partner_id,
            request_id: Date.now().toString(),
            sign: sign
        }).toString(), {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Giả lập trình duyệt để tránh bị chặn
            }
        });
        // ------------------------------------------------------

        // Trả kết quả từ doithe1s về cho giao diện web của bạn
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        // Nếu có lỗi kết nối, trả về thông báo lỗi cho web
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                status: 0, 
                message: "Lỗi kết nối API: " + (error.response ? JSON.stringify(error.response.data) : error.message) 
            })
        };
    }
};
