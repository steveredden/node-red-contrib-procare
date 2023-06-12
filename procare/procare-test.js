module.exports = function(RED) {

    function ProcareTest(input) {
        RED.nodes.createNode(this, input);
        this.conf = RED.nodes.getNode(input.conf);

        var node = this;

        node.on('input', function(msg) {

            msg.payload = {
                "conf": this.conf,
                "c.e" : this.conf.credentials.email,
                "c.p" : this.conf.credentials.password
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("procare-test", ProcareTest);
    
}