function calc(dt) {
    if (tmp.pass) {
        player.p = player.p.add(tmp.pGain.mul(dt)).min(1)

        let s = 300
        if (player.double >= 5) s *= 4
        if (player.double >= 7) s *= 5

        for (let y = 0; y < tmp.charge_len[0]; y++) for (let x = 0; x < tmp.charge_len[1]; x++) {
            let yy = y+1, xx = x+1

            let c = player.charge[y]

            c[x] = true || player.charge_ch == yy+""+xx ? Math.min(1, c[x] + dt/10) : Math.max(0,c[x] - dt/s)
        }

        if (player.double >= 6) finishBox()
    }

    tmp.pass = true

    tmp.time += dt
    player.p_time += dt
    player.time += dt
}