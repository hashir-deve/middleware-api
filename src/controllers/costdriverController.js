
const axios = require('axios');
var httpntlm = require('httpntlm');

const ERP_USERNAME = process.env["ERP_USERNAME"];
const ERP_PASSWORD = process.env["ERP_PASSWORD"];

const MJDController = {
    createCostDrivers: async (req, res, next) => {
        const createUrl = `http://10.243.132.25:7048/BC250/ODataV4/Company('MSP')/CostDrivers`;
        const requestBody = req.body;
        
        const newRequestBody = {
            Vendor_No: requestBody["Ref. ID"],
            Vendor_Name: requestBody["Ref. Name"],
            Customer_ID: requestBody["Customer ID"],
            Customer_Name: requestBody["Customer Name"],
            Service_Code: requestBody["Service ID"],
            Service_Name: requestBody["Service Name"],
            Date: requestBody["Date"],
            Quantity: requestBody["Quantity"],
            Amount: requestBody["Amount"],
            Comment: requestBody["Comment"],
            Status: requestBody["Status"]
        }

        httpntlm.post({
            url: createUrl,
            username: ERP_USERNAME,
            password: ERP_PASSWORD,
            workstation: 'domain',
            // domain: 'mait',
            body: JSON.stringify(newRequestBody),
            headers:{
                'Content-type': 'application/json'
              }
        }, function (err, response) {
            if (err) {
                console.log(err);
                return err;
            };
            if(response.statusCode == 200 || response.statusCode == 201)
            {
                return res.json(response.body);
            }
            console.log(response);
            return res.status(500).json(response) 
        });
    },
}

module.exports = {
    MJDController
}