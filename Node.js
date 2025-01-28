case "akrab":
    if (!args[0]) {
        Sky.sendMessage(m.chat, { text: "⚠️ Harap masukkan nomor MSISDN!\n\nContoh: *akrab 085924738647*" });
        break;
    }

    const msisdn = args[0];

    if (msisdn.length < 10) {
        Sky.sendMessage(m.chat, { text: "⚠️ Nomor tidak valid! Masukkan nomor dengan benar." });
        break;
    }

    Sky.sendMessage(m.chat, { text: `🔄 Sedang mengecek kuota untuk nomor: *${msisdn}*...` });

    try {
        const response = await axios.post("https://griyaflazz.xyz/ajax/cek-cuan.php", new URLSearchParams({ msisdn }));
        const result = response.data;

        if (!result.status || !result.packages || result.packages.length === 0) {
            Sky.sendMessage(m.chat, { text: `❌ Tidak ditemukan data untuk nomor *${msisdn}*.` });
            break;
        }

        let message = `✅ *Hasil cek kuota untuk ${msisdn}:*\n\n`;

        result.packages.forEach((pkg, index) => {
            // Format tanggal dari YYYY-MM-DDTHH:MM:SS ke DD-MM-YYYY
            let formattedDate = pkg.expDate.split("T")[0].split("-").reverse().join("-");

            message += `📦 *Paket ${index + 1}:* ${pkg.name}\n`;
            message += `📅 *Masa Aktif:* ${formattedDate}\n`;

            if (pkg.benefits && pkg.benefits.length > 0) {
                pkg.benefits.forEach((benefit) => {
                    message += `🔹 *${benefit.bname}* - ${benefit.type}\n`;
                    message += `📊 *Kuota:* ${benefit.quota}\n`;
                    message += `💾 *Sisa:* ${benefit.remaining}\n\n`;
                });
            }
        });

        Sky.sendMessage(m.chat, { text: message.trim() });

    } catch (error) {
        Sky.sendMessage(m.chat, { text: "❌ Gagal cek kuota. Mungkin server sedang down atau ada kesalahan." });
    }
    break;