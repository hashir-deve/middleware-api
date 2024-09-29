var httpntlm = require('httpntlm');

const ERP_USERNAME = process.env["ERP_USERNAME"];
const ERP_PASSWORD = process.env["ERP_PASSWORD"];
const DYNAMICS_BASE_URL = process.env["DYNAMICS_BASE_URL"];
const DYNAMICS_COMPANY_ID = process.env["DYNAMICS_COMPANY_ID"];


const MJDJournalsController  = {
    getJournals: async (req, res, next) => {
        try 
        {
            const journalsId = req.params.id;
            const getUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals${journalsId}`;

            httpntlm.get({
                url: getUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                domain: '',
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
        } 
        catch (error) 
        {
            console.log(error);
            return res.status(500).json(error) 
        }
    },

    createJournals: async (req, res, next) => {
        try
        {

            const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals`;
            const requestBody = req.body;
            
            httpntlm.post({
                url: createUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                // domain: 'mait',
                body: JSON.stringify(requestBody),
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
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).json(error);            
        }
    },

    updateJournals: async (req, res, next) => {
        try{

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
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json(error);                    
        }
    },

    
    createTransactions: async (req, res, next) => {
        try
        {
            const createJournalUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journals`;
            const createJournalLinesUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/journalLines`;
            const journalRequestBody = req.body.journals;
            const journalLinesRequestBody = req.body.journalLines;
            const responseArray = []

            if(!journalRequestBody)
                throw Error("Journals request body is missing.");
            if(!journalLinesRequestBody)
                throw Error("JournalLines request body is missing.");

            httpntlm.post({
                url: createJournalUrl,
                username: ERP_USERNAME,
                password: ERP_PASSWORD,
                workstation: 'domain',
                // domain: 'mait',
                body: JSON.stringify(journalRequestBody),
                headers:{
                    'Content-type': 'application/json'
                }
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                };
                // Send Request to create journal lines after successfull creation of journal lines
                if(response.statusCode == 200 || response.statusCode == 201)
                {
                    const journalResponse = JSON.parse(response.body);
                    responseArray.push(journalResponse);
                    try{
                        journalLinesRequestBody.journalId = journalResponse.id;
                        httpntlm.post({
                            url: createJournalLinesUrl,
                            username: ERP_USERNAME,
                            password: ERP_PASSWORD,
                            workstation: 'domain',
                            // domain: 'mait',
                            body: JSON.stringify(journalLinesRequestBody),
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
                                responseArray.push(JSON.parse(response.body))
                                return res.json(responseArray);
                            }
                            console.log(response);
                            return res.status(500).json(response) 
                        });
                    }
                    catch (error)
                    {
                        console.log(error);
                        return res.status(500).json(error);            
                    }
                }
                else
                {
                    console.log(response);
                    return res.status(500).json(response) 
                }
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).json(error);            
        }   
    }
}
module.exports = {
    MJDJournalsController
}