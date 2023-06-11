const uri = "https://api-school.procareconnect.com";

module.exports = function (RED) {

    function procareAccount(input) {
        RED.nodes.createNode(this, input);
    }

    RED.nodes.registerType("procare-account", procareAccount, {
        credentials: {
            "email":    { type: 'text' },
            "password": { type: 'password' }
        }
    })

    function procareMedia(input) {
        RED.nodes.createNode(this, input);
        this.conf = RED.nodes.getNode(input.conf)

        var node = this;

        node.on('input', function() {
            const token = _getAuthToken(node)

            if (token == null) {
                return
            }

            var messages = _fetchMessages(_makeHeaders(token), _getDateString())
            node.send([messages]);
        });
    }

    RED.nodes.registerType("procare-mediaurls", procareMedia);
    
}

function _getAuthToken(node) {
    const body = JSON.stringify({
        email: node.conf.credentials.email,
        password: node.conf.credentials.password
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

function _makeHeaders(authToken) {
    return {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };
}

function _getDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];   // ex. 2023-06-05T10:36:39 -> 2023-06-05
}

function _fetchMessages(headers, date) {

    var messages = [];

    fetch(`${uri}/api/web/parent/kids/`, {
        headers: headers
    })
        .then(response => response.json())
        .then(kidsResp => {
            kidsResp.kids.forEach(kid => {
            fetch(
                `${uri}/api/web/parent/daily_activities/?kid_id=${kid.id}&filters[daily_activity][date_to]=${date}&page=1`,
                { headers: headers }
            )
                .then(response => response.json())
                .then(activities => {
                activities.daily_activities.forEach(activity => {
                    if ( activity.photo_url != null ) {
                        messages.push(
                            {
                                "basename": _getPhotoGuid(activity.photo_url),
                                "comment": activity.comment,
                                "datetime": activity.activity_time,
                                "headers": headers,
                                "url": activity.photo_url,
                            }
                        )
                    }
                });
            });
        });
    });

    return messages;
}

function _getPhotoGuid(url) {
    const regex = /\/([a-fA-F0-9-]+)\/[^/]+$/;
    const matches = url.match(regex);

    if (matches && matches.length > 1) {
        return matches[1];
    } else {
        return null
    }
}