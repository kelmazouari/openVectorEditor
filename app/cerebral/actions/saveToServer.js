// upload a copy of the current plasmid in genbank or sbol format to ice
import request from 'superagent/lib/client';
import assign from 'lodash/object/assign';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToServer({input, state, output}) {
    // BUILD AN OBJECT FROM THE STATE TREE THAT'S SETUP THE WAY JSON WANTS
    // MAKE SURE YOU'RE TYPING IN ALL CAPS
    // THEN PUT THAT OBJECT IN THE BODY OF THE REQUEST TO THE URL BELOw
    // BOOYAH
    var sequenceData = state.get("sequenceData");
    var newSequenceData = {};
    // massage the data back into a form that ICE can accept
    newSequenceData.seqId = newSequenceData._id;
    newSequenceData.isCircular = newSequenceData.circular;
    newSequenceData.name = sequenceData.name;
    newSequenceData.sequence = sequenceData.sequence;
    // var feature = {};
    // for(var f = 0; f++; f<sequenceData.features.length) {
    //     feature = newSequenceData.features[f];
    //     feature.locations.genbankStart = feature.start;
    //     feature.locations.end = feature.end;
    // }
    newSequenceData.uri = window.location.origin + "/rest/parts/" + id;

    // remember to do checks for bad id and sid and sequence length

    // parts is always parts, even for plasmids and seeds
    request
        .post('rest/parts/' + id + '/sequence?sid=' + sid)
        .set('X-ICE-Authentication-sessionId', sid)
        .set('Content-Type', 'application/json')
        .send(newSequenceData)
        .end(function(err, result) {
            if(err) {
                console.log("unable to save to registry, something went wrong: " + err)
            }
        }
    );
}