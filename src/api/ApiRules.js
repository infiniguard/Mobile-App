class Constant {
    //static BASE_URL = "http://3.21.206.6/slim_api/public/";
    static BASE_URL = "https://maintenance.infiniguard.com/slim_api/public/";

    static URL_qrScan = Constant.BASE_URL + 'qr_code/scan';
    static URL_login = Constant.BASE_URL + 'Applicator/login';
    static URL_qrRegister = Constant.BASE_URL + 'qr_details/insert';
    static URL_qrInspection = Constant.BASE_URL + 'inspection/insert';
    static URL_WarrantyClaim = Constant.BASE_URL + 'qr_code/WarrantyClaim';
    static URL_forgot = Constant.BASE_URL + 'Applicator/forgetPassword';
    static URL_sendReport = Constant.BASE_URL + 'qr_code/InspectionReport';
    }

var WebServices = {
    callWebService: function(url, formBody) {
        console.log(url,formBody)

        return fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'multipart/form-data;charset=UTF-8'                
                },
                body: formBody
            })
            .then(response => response.text()) // Convert to text instead of res.json()
            .then((text) => {
                
                return text;
            })
            .then(response => JSON.parse(response)) // Parse the text.
            .then((jsonRes) => {
              
                return jsonRes; //main output
            }).catch((error)=>console.log("error",error))
    },

    callWebService_GET: function(url, body) {
        return fetch(url, { 
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.text())
            .then((text) => {
              return text;
            })
            .then(response => JSON.parse(response))
            .then((jsonRes) => {
                return jsonRes;
            });
    }
}
module.exports = {
    Constant,
    WebServices
}
