module.exports = function(RED) {

    function ProcareAccount(input) {
        RED.nodes.createNode(this, input);

        this.name = input.name;
    }

    RED.nodes.registerType("procare-account", ProcareAccount, {
        credentials: {
            "email":    { type: 'text' },
            "password": { type: 'password' }
        }
    });
}