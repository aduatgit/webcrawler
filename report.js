
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function printReport(pages){
    console.log('\n----------- Starting report -----------\n')
    let sortable = []
    for (const [key, value] of Object.entries(pages)){
        sortable.push([key, value])
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (const value of sortable){
        console.log(`Found ${value[1]} internal links to ${value[0]}`)
    }
}

module.exports = {
    printReport
}