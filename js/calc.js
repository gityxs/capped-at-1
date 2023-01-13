function calc(dt) {
    if (tmp.end) {
        tmp.end_time += dt
    } else {
        if (tmp.pass) {
            player.p = player.p.add(tmp.pGain.mul(dt)).min(1)
    
            let s = 300
            if (player.double >= 5) s *= 4
            if (player.double >= 7) s *= 5
    
            let f = 10
            if (player.triple >= 1) f /= 10
    
            let nd = player.double >= 9
    
            for (let y = 0; y < tmp.charge_len[0]; y++) for (let x = 0; x < tmp.charge_len[1]; x++) {
                let yy = y+1, xx = x+1
    
                let c = player.charge[y]
    
                c[x] = player.charge_ch == yy+""+xx ? Math.min(1, c[x] + dt/f) : nd ? c[x] : Math.max(0,c[x] - dt/s)
            }
    
            if (player.double >= 6) finishBox()
            if (player.triple >= 3) MAIN.double.reset()
    
            for (let x = 0; x < GLYPH_LEN; x++) {
                if (player.glyph_eq[x] > 0) {
                    let t = player.glyph[x].add(tmp.glyph.gain[x].mul(dt))
    
                    while (t.gte(1)) {
                        let l = ++player.glyph_level[x]
    
                        t = t.sub(1).div(Decimal.pow(2,l**1.1)).mul(Decimal.pow(2,(l-1)**1.1))
                    }
    
                    player.glyph[x] = t
                }
            }
        }
    
        tmp.pass = true
    
        tmp.time += dt
        player.p_time += dt
        player.time += dt
    }
}