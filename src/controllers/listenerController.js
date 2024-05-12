const axios = require('axios');
const Process = require('../models/process');

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

            dbProcess.forEach(async (processItem) => {
                const destinationUrl = processItem.url;
                // Send the request body to another URL via POST request
                try
                {
                    const response = await axios.post(destinationUrl, requestBody);
                    if(response.status != 200)
                    {
                        throw response.message;
                    }
                    return res.json("Sent Request to Other Server Successfully!")
                }
                catch(err)
                {
                    console.log(err);
                    return res.status(500).json(err);
                }

            })
        
            // Send response back to the client
            res.status(response.status).json(response.data);
          } catch (error) {
            // Handle errors
            res.status(500).json({ error: 'Internal server error' });
          }
    }

}
module.exports = {
    ListenerController
}