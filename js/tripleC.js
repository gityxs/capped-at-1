MAIN.triple = {
    formula() {
        let r = player.double

        let x = Math.min(1,r/(15+Math.min(5,player.triple*3)))

        return x
    },
    progress() {
        return tmp.triple_formula
    },

    reset() {
        if (tmp.triple_formula >= 1) {
            player.triple_unl = true
            player.triple++
            this.doReset()
        }
    },
    doReset(order='b3') {
        player.double = player.triple>=2 ? 10 : 0
        player.charge_ch = ''
        
        if (player.triple<2) for (let x = 0; x < 5; x++) {
            let p = []
            for (let y = 0; y < 5; y++) p.push(0)
            player.charge[x] = p
        }

        MAIN.double.doReset(order)

        updateTemp()
    },

    penalty() {
        let r = player.triple
        let b = r

        if (b > 5) b = (b/5)**2*5

        let p = Math.max(0,3*b-2)/20+1

        let q = Math.max(0,4*b-2)

        return [p,q]
    },

    get_glyph() {
        let r = player.triple

        let x = Math.max(0,r*3)

        return x
    },

    glyph_name: [
        ['智','Zhi'],
        ['力','Li'],
        ['速','Su'],
        ['灵','Ling'],
    ],
    glyph_gain(i) {
        let g = player.glyph_eq[i]

        if (g==0) return E(0)

        let l = player.glyph_level[i]

        let x = Decimal.pow(10,g**1.25-2).div(i==3?1e9:(3+i)**i).div(Decimal.pow(2,l**1.1))

        return x
    },
    glyph_eff: [
        [
            l=>{
                let x = 1+l/5

                if (l>50) x *= 1+(l-50)/2

                return x
            },
            x=>"<b>^"+format(x,2)+"</b> to <b>Points</b> gain"
        ],[
            l=>{
                let x = 1+l/10

                if (l>50) x *= 1+(l-50)/2

                return x
            },
            x=>"<b>x"+format(x,2)+"</b> to <b>ψ</b> base"
        ],[
            l=>{
                let x = l**0.5/15

                return x
            },
            x=>"<b>+^"+format(x)+"</b> to <b>Double Compacted Box</b>'s claim formula"
        ],[
            l=>{
                let x = 1+l**0.9/90

                return x
            },
            x=>"<b>x"+format(x)+"</b> to <b>Double Compacted Box</b>'s weakness"
        ],
    ],

    addGlyph(i,a) {
        if (a > 0 && tmp.glyph.unspent <= 0) return;

        player.glyph_eq[i] = Math.max(0,player.glyph_eq[i]+a*(a>0?tmp.glyph.unspent:tmp.glyph.total))
    },

    milestone: [
        {
            r: 2,
            desc: `Start with 10 <b>Double Compacted Boxes</b>. Keep chargers on <b>Triple Compacted Box</b>. <b>Charge Core</b>'s active time is <b>10x</b> faster.`,
        },{
            r: 3,
            desc: `Automate <b>Double Compacted Box</b>. Unlock new <b>Ancient Glyph</b>'s type.`,
        },{
            r: 4,
            desc: `Keep <b>Research Upgrades</b> bought on <b>Double Compacted Box</b>.`,
        },{
            r: 5,
            desc: `Add <b>1</b> to <b>Upgrade Charger</b> per <b>Triple Compacted Box</b>, starting at 4.`,
        },
    ],
}

const GLYPH_LEN = MAIN.triple.glyph_name.length

tmp_update.push(()=>{
    let mt = MAIN.triple

    let gt = tmp.glyph

    gt.len = 3
    if (player.triple >= 3) gt.len++

    gt.total = mt.get_glyph()

    let s = 0

    for (let i=0; i<GLYPH_LEN; i++) {
        s += player.glyph_eq[i]

        gt.gain[i] = mt.glyph_gain(i)
        gt.eff[i] = mt.glyph_eff[i][0](player.glyph_level[i])
    }

    gt.unspent = Math.max(0, gt.total-s)

    tmp.triple_formula = mt.formula()
    tmp.triple_progress = mt.progress()

    tmp.triple_penalty = mt.penalty()
})