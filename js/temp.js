var tmp = {}
var tmp_update = []

function resetTemp() {
    keep = []
    tmp = {
        progress: 0,
        time: 0,
        pass: true,

        resUpgs: {
            scale: 1,
            cost: [],
            effect: [],
        },

        double_penalty: [1,1],
        charge_len: [2,2],

        charger_upgrade: 0,

        tab: 'box',
    }
}

function updateTemp() {
    for (let x = 0; x < tmp_update.length; x++) tmp_update[x]()
}