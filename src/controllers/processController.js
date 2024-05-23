const Process = require('../models/process');

const ProcessController = {
    
    getProcess : async (req, res, next) => {
        try 
        {
            Process.find()
            .then((dbProcesses) => {
                const processes = dbProcesses;
    
                console.log("-- Retrieved Processes", processes);
                return res.json(processes);
            })
            .catch((err) => {
                throw err
            })
        } 
        catch (error)
        {
            return res.status(500).json(error)
        }
    },
    createProcess : async (req, res, next) => {
        const body = req.body;
        console.log(body);
        const process = new Process({
            name: body.name,
            sourceUrl: body.sourceUrl,
            processes: body.processes
        });

        await process.save();
        return res.json("Succeeded!");
    },
    deleteProcess : async (req, res, next) => {
        // const body = req.body;
        const processId = req.params.id;
        const deletedObject = await Process.deleteOne({ _id: processId }); // returns {deletedCount: 1}

        if(deletedObject.deleteCount == 0){
            return res.status(500).json("Coudn't find and delete document with id: ", processId);
        }

        return res.json("Successfully Deleted!");
    }

}
module.exports = {
    ProcessController
}