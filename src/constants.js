const nodes = [
    "0: ple4.ipv6.lip6.fr (France)",
    "1: planetlab1.jhu.edu (USA, Maryland)",
    "2: planetlab2.csuohio.edu (USA, Ohio)",
    "3: 75-130-96-12.static.oxfr.ma.charter.com (USA, Massachussets)",
    "4: planetlab1.cnis.nyit.edu (USA, New York)",
    "5: saturn.planetlab.carleton.ca (Canada, Ontario)",
    "6: planetlab-03.cs.princeton.edu (USA, New Jersey)",
    "7: prata.mimuw.edu.pl (Poland)",
    "8: planetlab3.upc.es (Spain)",
    "9: pl1.eng.monash.edu.au (Australia)"
];

const nodesMap = {
    "0: ple4.ipv6.lip6.fr (France)": 0,
    "1: planetlab1.jhu.edu (USA, Maryland)": 1,
    "2: planetlab2.csuohio.edu (USA, Ohio)": 2,
    "3: 75-130-96-12.static.oxfr.ma.charter.com (USA, Massachussets)": 3,
    "4: planetlab1.cnis.nyit.edu (USA, New York)": 4,
    "5: saturn.planetlab.carleton.ca (Canada, Ontario)": 5,
    "6: planetlab-03.cs.princeton.edu (USA, New Jersey)": 6,
    "7: prata.mimuw.edu.pl (Poland)": 7,
    "8: planetlab3.upc.es (Spain)": 8,
    "9: pl1.eng.monash.edu.au (Australia)": 9
}

const traceTypes = {
    E: "emission",
    R: "reception"
};

function parseMillisecondsIntoReadableTime(milliseconds){
    //Get hours from milliseconds
    let hours = milliseconds / (1000*60*60);
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    let minutes = (hours - absoluteHours) * 60;
    let absoluteMinutes = Math.floor(minutes);
    let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    let seconds = (minutes - absoluteMinutes) * 60;
    let absoluteSeconds = Math.floor(seconds);
    let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    let ms = (milliseconds % 1000).toString().padStart(3, '0');

    return h + ':' + m + ':' + s + "." + ms;
}


export {nodes, traceTypes, nodesMap, parseMillisecondsIntoReadableTime}