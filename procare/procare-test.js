const uri = "https://api-school.procareconnect.com"

module.exports = function(RED) {

    function ProcareTest(input) {
        RED.nodes.createNode(this, input);
        this.conf = RED.nodes.getNode(input.conf);

        var node = this;

        node.on('input', function(msg) {

            this.msg = msg;

            const body = JSON.stringify({
                "email"   : this.conf.credentials.email,
                "password": this.conf.credentials.password
            });
        
            fetch(`${uri}/api/web/auth/`, {
                method: "POST",
                body: body,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(authResp => {
                    msg.authToken = authResp.user.auth_token;
                    node.send(msg);
            });
        });
    }

    RED.nodes.registerType("procare-test", ProcareTest);
    
}