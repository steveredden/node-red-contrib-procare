const uri = "https://api-school.procareconnect.com"
const date = new Date().toISOString().split("T")[0];   // ex. 2023-06-05T10:36:39 -> 2023-06-05

module.exports = function(RED) {

    function ProcareMedia(input) {
        RED.nodes.createNode(this, input);
        this.conf = RED.nodes.getNode(input.conf);

        var node = this;

        node.on('input', function(msg) {

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
                    this.authToken = authResp.user.auth_token;

                    if ( null != this.authToken ) {
                        const headers = {
                            "Authorization": `Bearer ${this.authToken}`,
                            "Content-Type" : "application/json"
                        }

                        var messages = [];

                        fetch(`${uri}/api/web/parent/kids/`, {
                            headers: headers
                        })
                            .then(response => response.json())
                            .then(kidsResp => {
                                kidsResp.kids.forEach(kid => {
                                fetch(
                                    `${uri}/api/web/parent/daily_activities/?kid_id=${kid.id}&filters[daily_activity][date_to]=${date}&filters[daily_activity][date_from]=${date}&page=1`,
                                    { headers: headers }
                                )
                                    .then(response => response.json())
                                    .then(activities => {
                                    activities.daily_activities.forEach(activity => {
                                        if ( activity.photo_url != null ) {
                                            _loadImageAsBase64(activity.photo_url, headers)
                                                .then(base64String => {
                                                    messages.push(
                                                        {
                                                            "base64"  : base64String,
                                                            "basename": _getPhotoGuid(activity.photo_url),
                                                            "comment" : activity.comment,
                                                            "datetime": activity.activity_time,
                                                            "url"     : activity.photo_url
                                                        }
                                                    )
                                                })
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
        });
    }

    RED.nodes.registerType("procare-media", ProcareMedia);
    
}

function _fetchMessages(headers, date) {

    

    return messages;
}

function _getPhotoGuid(url) {
    const regex = /\/([a-fA-F0-9-]+)\/[^/]+$/;
    const matches = url.match(regex);

    if (matches && matches.length > 1) {
        return matches[1];
    } else {
        console.error("Failed to identify photo name")
        return null;
    }
}

async function _loadImageAsBase64(url, headers) {
    const response = await fetch(url, {headers: headers});
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }