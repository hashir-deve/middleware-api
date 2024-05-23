const axios = require('axios');
const Process = require('../models/process');
const { saveAs } = require('file-saver');
const NtlmClient = require('node-client-ntlm').NtlmClient;
var httpntlm = require('httpntlm');

const AUTHORIZATION = process.env["AUTHORIZATION"];

const CLIENT_ID = process.env["CLIENT_ID"];
const CUSTOMER_ID = process.env["CUSTOMER_ID"];
const ERP_USERNAME = process.env["ERP_USERNAME"];
const ERP_PASSWORD = process.env["ERP_PASSWORD"];


const ListenerController = {
    
    processRequest : async (req, res, next) => {
        try {
            const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            const requestBody = req.body;
            
            const record = await Process.findOne({'sourceUrl':requestUrl});

            const dbProcess = record.processes;

            if(dbProcess.length == 0){
                return res.status("500").json("Invalid Process: Empty processes array");
            }

            let destinationUrl = "";
            const reqBody = {}
            // dbProcess.forEach(async (processItem) => {
            for (const [key, value] of Object.entries(dbProcess[1])) {
                console.log(key, value);
                if(key.includes('url')){
                    destinationUrl = value
                }
                else
                {
                    if(!!value.key)
                        reqBody[value.key] = value.value
                }
            }    
            let response
            // Send the request body to another URL via POST request
                const client = new NtlmClient();
            
                try {
                    
                    let response = {}
                    httpntlm.post({
                        url: destinationUrl,
                        username: ERP_USERNAME,
                        password: ERP_PASSWORD,
                        workstation: 'domain',
                        domain: '',
                        body: JSON.stringify(reqBody)
                    }, function (err, response){
                        if(err) {
                            console.log(err);
                            return err
                        };
                        return res.json(response.body);
                        // console.log(res.headers);
                        // console.log(res.body);
                    });

            }
            catch(err)
            {
                console.log(err);
                return res.status(500).json(err);
            }
    
          } catch (error) {
            // Handle errors
            res.status(500).json({ error: 'Internal server error' });
          }
    },

    createCustomer : async (req, res, next) => {
        const pipeline = [
            {
                type: "GET",
                url: "http://erp.itassociates.sa:7048/bc230/api/v2.0/companies(6e8c5ffe-11aa-ee11-a56d-6045bdacca02)/documentAttachments(26f4c128-c612-ef11-9303-000c29b3ff67)/attachmentContent",
                description: "Get File from Dynamics 365"
            },
            {
                type: "POST",
                url: "http://2.59.55.157:8082/api/v1/file/upload",
                description: "Get File Token from Dynamics 365"
            },
            {
                type: "GET",
                url: `http://erp.itassociates.sa:7048/bc230/api/v2.0/companies(6e8c5ffe-11aa-ee11-a56d-6045bdacca02)/customers(${CUSTOMER_ID})`,
                description: "Get File Token from Dynamics 365"
            },
            {
                type: "POST",
                url: "http://2.59.55.157:8082/api/v1/erp/profiles",
                description: "Get File Token from Dynamics 365"
            }
        ]
        
        const requestBody = req.body;
        var file = {};
        let vatToken = '';
        let ibanToken = '';

        for (let i = 0; i < pipeline.length; i++) {
            if(i == 0)
            {
                httpntlm.get({
                    url: pipeline[0].url,
                    username: ERP_USERNAME,
                    password: ERP_PASSWORD,
                    workstation: 'domain',
                    domain: ''
                }, async function (err, response){
                    if(err) {
                        console.log(err);
                        return err
                    };
                    const contents= response.body;
                    var blob = new Blob([contents], { type: 'data:application/pdf' });
                    file = new File([blob], "file.pdf", {type: "data:application/pdf"});
                    console.log(typeof file);
                    console.log(res.body);

                    const bodyFormData = new FormData();
                    bodyFormData.append("file", file);
                    try{

                        const {data} = await axios.post(pipeline[1].url, bodyFormData, {
                            headers: {
                                fileId: '1088776604',
                                fileType: 'vat',
                                Authorization: AUTHORIZATION,
                                client_id: CLIENT_ID
                            }
                        })
                        console.log(data);
                        vatToken = data['fileToken'];

                        const ibanData = await axios.post(pipeline[1].url, bodyFormData, {
                            headers: {
                                fileId: '1088776605',
                                fileType: 'iban',
                                Authorization: AUTHORIZATION,
                                client_id: CLIENT_ID
                            }
                        })
                        console.log(ibanData.data);
                        ibanToken = ibanData.data['fileToken'];
                        
                        let customerDetails = {};

                        httpntlm.get({
                            url: pipeline[2].url,
                            username: ERP_USERNAME,
                            password: ERP_PASSWORD,
                            workstation: 'domain',
                            domain: ''
                        }, async function (err, response){
                            if(err) {
                                console.log(err);
                                return err
                            };
                            customerDetails = JSON.parse(response.body);

                            const body = {
                                header: {},
                                body: {
                                    vatFileToken: vatToken,
                                    email: customerDetails['email'],
                                    expectedNumberOfBills: 10,
                                    industryName: "DigiCash",
                                    otp: "928513",
                                    mobileNumber: requestBody["mobileNumber"],
                                    bic: "RJHISARI",
                                    iban: requestBody["iban"],
                                    expectedSumOfBills: 5000,
                                    ibanFileToken: ["ibanToken"],
                                    businessType: requestBody["businessType"],
                                    idNumber: requestBody["idNumber"],
                                    vatNumber: requestBody["vatNumber"],
                                    commercialRegisterNumber: requestBody["commercialRegisterNumber"]
                                }
                            }
                            try
                            {
                                const {data} = await axios.post(pipeline[3].url, body, {
                                    headers: {
                                        Authorization: AUTHORIZATION,
                                        client_id: CLIENT_ID
                                    }
                                })
                                console.log(data);
                                return res.json(`Customer Created Successfully with following details: ${data}`);
                            }
                            catch(err)
                            {
                                console.log(err);
                                return res.status(500).json(err);
                            }
                        })  
                    }
                    catch(err)
                    {
                        console.log(err);
                        return res.status(500).err(err);
                    }
                });
            }

        }
    }
}
module.exports = {
    ListenerController
}