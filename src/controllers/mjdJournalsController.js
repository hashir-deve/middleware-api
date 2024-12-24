var httpntlm = require('httpntlm');

const ERP_USERNAME = process.env["ERP_USERNAME"];
const ERP_PASSWORD = process.env["ERP_PASSWORD"];
const DYNAMICS_BASE_URL = process.env["DYNAMICS_BASE_URL"];
const DYNAMICS_COMPANY_ID = process.env["DYNAMICS_COMPANY_ID"];
const CreateJournalLinesUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journalLines`;
const BalancingGlAccountNumber = `${process.env["BalancingGlAccountNumber"]}`
const CommissionGlAccountNumber = `${process.env["CommissionGlAccountNumber"]}`
const VatGlAccountNumber = `${process.env["VatGlAccountNumber"]}`

const MJDJournalsController = {
    getJournals: async (req, res, next) => {
        try {
            const journalsId = req.params.id;
            const getUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals${journalsId}`;

            httpntlm.get({
                url: getUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                domain: '',
                headers: {
                    'Content-type': 'application/json'
                }
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                };
                if (response.statusCode == 200 || response.statusCode == 201) {
                    return res.json(response.body);
                }
                console.log(response);
                return res.status(500).json(response)
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },

    createJournals: async (req, res, next) => {
        try {

            const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals`;
            const requestBody = req.body;

            httpntlm.post({
                url: createUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                // domain: 'mait',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-type': 'application/json'
                }
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                };
                if (response.statusCode == 200 || response.statusCode == 201) {
                    return res.json(response.body);
                }
                console.log(response);
                return res.status(500).json(response)
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    updateJournals: async (req, res, next) => {
        try {

            const journalsId = req.params.id;
            const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals${journalsId}`;
            const requestBody = req.body;

            httpntlm.patch({
                url: createUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                // domain: 'mait',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-type': 'application/json'
                }
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                };
                if (response.statusCode == 200 || response.statusCode == 201) {
                    return res.json(response.body);
                }
                console.log(response);
                return res.status(500).json(response)
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },


    createTransactions: async (req, res, next) => {
        try {
            const createJournalUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals`;
            const parsedRequestBody = parseRequestBody(req.body)
            const journalRequestBody = parsedRequestBody.journal;
            const journalLinesRequestBody = parsedRequestBody.journalLines;
            const responseArray = [];
            const errorMessages = [];

            if (!journalRequestBody)
                throw Error("Journals request body is missing.");
            if (!journalLinesRequestBody)
                throw Error("JournalLines request body is missing.");

            httpntlm.post({
                url: createJournalUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                // domain: 'mait',
                body: JSON.stringify(journalRequestBody),
                headers: {
                    'Content-type': 'application/json'
                }
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                };
                // Send Request to create journal lines after successfull creation of journal lines
                if (response.statusCode == 200 || response.statusCode == 201) {
                    const journalResponse = JSON.parse(response.body);

                    responseArray.push({
                        journal: journalResponse
                    });

                    try {
                        const journalId = journalResponse.id;
                        const journalSize = journalLinesRequestBody.length;

                        createJournalLineRecursive(journalLinesRequestBody, journalId, 0, [], journalSize, res);
                    }
                    catch (error) {
                        console.log(error);
                        return res.status(500).json(error);
                    }
                }
                else {
                    console.log(response);
                    return res.status(500).json(response)
                }
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },


}

function parseRequestBody(body) {
    const uniqueCode = body[0].internalRefNumber;
    console.log('Code Batch', uniqueCode);
    const requestObject = {
        journal: {
            code: uniqueCode,
            displayName: "Default Journal Batch"
        },
        journalLines: []
    }

    let sourceWalletCodeChecked = false;

    body.forEach((journalLine, index) => {
        if (journalLine.amount != 0.00) {
            const creationTimestamp = journalLine.creationDate;
            const creationDate = new Date(creationTimestamp);
            const formattedCreationDate = creationDate.toLocaleDateString('en-CA'); // 'en-CA' outputs in YYYY-MM-DD format
            let accountType = 'G/L Account';
            let balancingAccountType = 'G/L Account';
            let accountNumber = BalancingGlAccountNumber;
            let balancingAccountNumber = '';

            if (index == 0){
                if (journalLine.sourceWalletCode == '000000'){
                    accountType = "Bank Account"
                }
                else 
                {
                    accountType = "Customer"
                }
                accountNumber = journalLine.sourceWalletCode
                    
                balancingAccountType = 'G/L Account'
                balancingAccountNumber = BalancingGlAccountNumber
            }
            else if(index === 1){
                balancingAccountType = 'Customer'
                balancingAccountNumber = journalLine.destinationWalletCode
            }
            else if(index === 2){
                balancingAccountNumber = CommissionGlAccountNumber;
            }
            else if(index === 3){
                balancingAccountNumber = VatGlAccountNumber;
            }
            
            const parsedJournalLine = {
                id: DYNAMICS_COMPANY_ID,
                lineNumber: journalLine.id,
                postingDate: formattedCreationDate,
                documentNumber: journalLine.internalRefNumber,
                externalDocumentNumber: journalLine.externalRefNumber,
                accountType: accountType,
                accountNumber: accountNumber,
                balanceAccountType: balancingAccountType,
                balancingAccountNumber: balancingAccountNumber,
                amount: journalLine.amount
            }
            requestObject.journalLines.push(parsedJournalLine)
        }
    });

    console.log(requestObject);
    return requestObject;
}

function createJournalLineRecursive(body, journalId, currentIndex, responseArray, size, res) {
    const reqBody = body[currentIndex];
    reqBody.journalId = journalId;

    httpntlm.post({
        url: CreateJournalLinesUrl,
        username: ERP_USERNAME,
        password: ERP_PASSWORD,
        workstation: 'domain',
        // domain: 'mait',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-type': 'application/json'
        }
    }, function (err, response) {
        if (err) {
            console.log(err);
            return err;
        };
        if (response.statusCode == 200 || response.statusCode == 201) {
            const journalNumber = `Journal Line ${currentIndex + 1}`;
            responseArray.push({
                [journalNumber]: JSON.parse(response.body)
            });

            if (currentIndex == size - 1)
                return res.json(responseArray);

            createJournalLineRecursive(body, journalId, ++currentIndex, responseArray, size, res)
        }
        else {
            console.log(response);
            return res.status(500).json(response);
        }
    });
}

module.exports = {
    MJDJournalsController
}