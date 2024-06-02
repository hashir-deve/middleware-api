var httpntlm = require('httpntlm');

const ERP_USERNAME = process.env["ERP_USERNAME"];
const ERP_PASSWORD = process.env["ERP_PASSWORD"];
const DYNAMICS_BASE_URL = process.env["DYNAMICS_BASE_URL"];
const DYNAMICS_COMPANY_ID = process.env["DYNAMICS_COMPANY_ID"];


const MJDItemCategoriesController  = {
    getItemCategories: async (req, res, next) => {
        try 
        {
            const itemCategoriesId = req.params.id;
            const getUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/itemCategories${itemCategoriesId}`;

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

    createItemCategories: async (req, res, next) => {
        try
        {

            const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/itemCategories`;
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

    updateItemCategories: async (req, res, next) => {
        try{

                const itemCategoriesId = req.params.id;
                const createUrl = `${DYNAMICS_BASE_URL}/companies(${DYNAMICS_COMPANY_ID})/itemCategories${itemCategoriesId}`;
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
}
module.exports = {
    MJDItemCategoriesController
}