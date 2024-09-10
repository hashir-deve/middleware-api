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
const DYNAMICS_BASE_URL = process.env["DYNAMICS_BASE_URL"];
const DYNAMICS_COMPANY_ID = process.env["DYNAMICS_COMPANY_ID"];

const ListenerController = {

    // processRequest: async (req, res, next) => {
    //     try {
    //         const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //         const requestBody = req.body;

    //         const record = await Process.findOne({ 'sourceUrl': requestUrl });

    //         const dbProcess = record.processes;

    //         if (dbProcess.length == 0) {
    //             return res.status("500").json("Invalid Process: Empty processes array");
    //         }

    //         let destinationUrl = "";
    //         const reqBody = {}
    //         // dbProcess.forEach(async (processItem) => {
    //         for (const [key, value] of Object.entries(dbProcess[1])) {
    //             console.log(key, value);
    //             if (key.includes('url')) {
    //                 destinationUrl = value
    //             }
    //             else {
    //                 if (!!value.key)
    //                     reqBody[value.key] = value.value
    //             }
    //         }
    //         let response
    //         // Send the request body to another URL via POST request
    //         const client = new NtlmClient();

    //         try {

    //             httpntlm.post({
    //                 url: destinationUrl,
    //                 username: ERP_USERNAME,
    //                 password: ERP_PASSWORD,
    //                 workstation: 'domain',
    //                 domain: '',
    //                 body: JSON.stringify(reqBody)
    //             }, function (err, response) {
    //                 if (err) {
    //                     console.log(err);
    //                     return err
    //                 };
    //                 return res.json(response.body);
    //             });

    //         }
    //         catch (err) {
    //             console.log(err);
    //             return res.status(500).json(err);
    //         }

    //     } catch (error) {
    //         // Handle errors
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // },

    processRequest: async (req, res, next) => {
        try {
            const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            const requestBody = req.body;

            const record = await Process.findOne({ 'sourceUrl': requestUrl });

            const dbProcess = record.processes;
            
            const dynamicFields = {}

            for (let [key, value] of Object.entries(requestBody)) {
                dynamicFields[key] = value;
            }

            if (dbProcess.length == 0) {
                return res.status("500").json("Invalid Process: Empty processes array");
            }

            let destinationUrl = dbProcess[0].url;
            let reqBody = {}
            // dbProcess.forEach(async (processItem) => {
                dbProcess[0].values.forEach((value) => {
                    if(dynamicFields.hasOwnProperty(value.key))
                    {
                        value.value = dynamicFields[value];
                        delete dynamicFields[value];
                    }
                    reqBody[value.key] = value.value;
                })

                try
                {

                    const response = await axios.post(destinationUrl, reqBody);
                    console.log(response.data);
                }
                catch(error)
                {
                    console.error('Error making POST request:', error);
                }

                for (const [key, value] of Object.entries(processItem.values)) {
                    console.log(key, value);
                    if (key.includes('url')) {
                        destinationUrl = value
                    }
                    else {
                        if (!!value.key)
                            reqBody[value.key] = value.value
                    }
                }
                let response
                // Send the request body to another URL via POST request
                const client = new NtlmClient();

                try {

                    httpntlm.post({
                        url: destinationUrl,
                        username: ERP_USERNAME,
                        password: ERP_PASSWORD,
                        workstation: 'domain',
                        domain: '',
                        body: JSON.stringify(reqBody)
                    }, function (err, response) {
                        if (err) {
                            console.log(err);
                            return err
                        };
                        return res.json(response.body);
                    });

                }
                catch (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
            // })
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    createCustomerDigicash: async (req, res, next) => {
        const pipeline = [
            {
                type: "GET",
                url: `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/documentAttachments(26f4c128-c612-ef11-9303-000c29b3ff67)/attachmentContent`,
                description: "Get File from Dynamics 365"
            },
            {
                type: "POST",
                url: "http://2.59.55.157:8082/api/v1/file/upload",
                description: "Get File Token from Dynamics 365"
            },
            {
                type: "GET",
                url: `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/customers(${CUSTOMER_ID})`,
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

        httpntlm.get({
            url: pipeline[0].url,
            username: ERP_USERNAME,
            password: ERP_PASSWORD,
            workstation: 'domain',
            domain: ''
        }, async function (err, response) {
            if (err) {
                console.log(err);
                return err
            };
            const contents = response.body;
            var blob = new Blob([contents], { type: 'data:application/pdf' });
            file = new File([blob], "file.pdf", { type: "data:application/pdf" });
            console.log(typeof file);
            console.log(res.body);

            const bodyFormData = new FormData();
            bodyFormData.append("file", file);
            try {

                const { data } = await axios.post(pipeline[1].url, bodyFormData, {
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
                }, async function (err, response) {
                    if (err) {
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
                    try {
                        const { data } = await axios.post(pipeline[3].url, body, {
                            headers: {
                                Authorization: AUTHORIZATION,
                                client_id: CLIENT_ID
                            }
                        })
                        console.log(data);
                        return res.json(`Customer Created Successfully with following details: ${data}`);
                    }
                    catch (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                })
            }
            catch (err) {
                console.log(err);
                return res.status(500).err(err);
            }
        });
    },

    createDynamicsCustomer: async (req, res, next) => {
        const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/customers`;
        const requestBody = req.body;
        // Content-type: application/json
        const dynamicsBody =  {
            displayName: "",
            type: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            phoneNumber: "",
            email: ""
        }
        
        const errorMessages = []
        for (let key in dynamicsBody) { 
            if(!requestBody[key])
            {
                errorMessages.push(`'${key}' Property doesn't exist in the request!`)
            }
            else
            {
                dynamicsBody[key] = requestBody[key];
            }
        }

        httpntlm.post({
            url: createUrl,
            username: ERP_USERNAME,
            password: ERP_PASSWORD,
            workstation: 'domain',
            domain: '',
            body: JSON.stringify(dynamicsBody),
            headers:{
                'Content-type': 'application/json'
              }
        }, function (err, response) {
            if (err) {
                console.log(err);
                return err;
            };
            return res.json(response.body);
        });
    },

    sendAttachmentFile: async (req, res, next) => {

    }
}
module.exports = {
    ListenerController
}