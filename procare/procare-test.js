const uri = "https://api-school.procareconnect.com"

module.exports = function(RED) {

    function ProcareTest(input) {
        RED.nodes.createNode(this, input);
        this.conf = RED.nodes.getNode(input.conf);

        var node = this;

        node.on('input', function(msg) {

            this.msg = msg;

            const authToken = _getAuthToken(node)
            msg.authToken = authToken;
            node.send(msg);
        });
    }

    RED.nodes.registerType("procare-test", ProcareTest);
    
}

function _getAuthToken(node) {
    const body = JSON.stringify({
        "email"   : node.conf.credentials.email,
        "password": node.conf.credentials.password
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
            return authResp.user.auth_token;
        });
    
    return null;
}