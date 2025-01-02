const _0x10664d=_0x4149;(function(_0x245cf0,_0xc8d81f){const _0x1da311=_0x4149,_0x43cc77=_0x245cf0();while(!![]){try{const _0x80e828=-parseInt(_0x1da311(0x104))/0x1*(-parseInt(_0x1da311(0x10c))/0x2)+-parseInt(_0x1da311(0x102))/0x3*(-parseInt(_0x1da311(0x107))/0x4)+-parseInt(_0x1da311(0x109))/0x5*(-parseInt(_0x1da311(0x101))/0x6)+-parseInt(_0x1da311(0x103))/0x7*(parseInt(_0x1da311(0xfe))/0x8)+parseInt(_0x1da311(0x108))/0x9*(parseInt(_0x1da311(0x100))/0xa)+parseInt(_0x1da311(0x105))/0xb+-parseInt(_0x1da311(0x106))/0xc;if(_0x80e828===_0xc8d81f)break;else _0x43cc77['push'](_0x43cc77['shift']());}catch(_0x2e942b){_0x43cc77['push'](_0x43cc77['shift']());}}}(_0x31c0,0x93067));function _0x4149(_0x2cdbed,_0xb2e745){const _0x31c03c=_0x31c0();return _0x4149=function(_0x414915,_0x56cc41){_0x414915=_0x414915-0xfe;let _0x4bef40=_0x31c03c[_0x414915];return _0x4bef40;},_0x4149(_0x2cdbed,_0xb2e745);}function _0x31c0(){const _0x2437d1=['6687428hHkbHd','26736300BaPowu','8rSrtwX','9nnuIYY','70okeKyT','createClient','aHR0cHM6Ly9iZXZ0cHh3Zmx4ZXpidHRhaXVwdi5zdXBhYmFzZS5jbw==','641140WatRqO','25072uNvlrr','ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KbGRuUndlSGRtYkhobGVtSjBkR0ZwZFhCMklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTXpVMk5EWTFOallzSW1WNGNDSTZNakExTVRJeU1qVTJObjAud3lPN1d2bUhramhJdVE0SkdiMW9NdFhfbEZNT052VlUwaWk4Rk9aQUt2Zw==','2504940jTrCkP','177438swesea','1025727aYJAJM','196xMdaKg','3nWmIVk'];_0x31c0=function(){return _0x2437d1;};return _0x31c0();}const s={'k':_0x10664d(0xff),'u':_0x10664d(0x10b)},sb=supabase[_0x10664d(0x10a)](atob(s['u']),atob(s['k']));

const formEl = document.getElementById("form");
const sponsorNoEl = document.getElementById("sponsor-no")
const sponsorNameEl = document.getElementById("sponsor-name");
const sponsorGsmEl = document.getElementById("sponsor-gsm");
const whatsappLinkEl = document.getElementById("whatsapp-link");
const instagramLinkEl = document.getElementById("instagram-link");

const sanitizePhoneNumber = number => {
  let sanitizedNumber = number.replace(/[^0-9]/g, "");
  if (sanitizedNumber.startsWith("0")) sanitizedNumber = sanitizedNumber.slice(1);
  if (!sanitizedNumber.startsWith("90")) {
    sanitizedNumber = "90" + sanitizedNumber;
  }
  return sanitizedNumber;
};

const getSponsorIdFromUrl = () => new URLSearchParams(window.location.search).get("sponsor");

async function fetchSponsorInfo(sponsorId) {
  const { data, error } = await sb.from("sponsors").select("*").eq("id", sponsorId);
  if (error || !data.length) console.error("Error fetching sponsor: ", sponsorId);
  return data || null;
}
sponsorNoEl.textContent = getSponsorIdFromUrl();

let sponsorInfo = null;
document.addEventListener("DOMContentLoaded", async () => {
  sponsorInfo = await fetchSponsorInfo(getSponsorIdFromUrl());
  if (sponsorInfo.length) {
    sponsorNameEl.style.color = "#25d366";
    sponsorNameEl.textContent = sponsorInfo[0].name;
    if (sponsorInfo[0].gsm) {
      sponsorGsmEl.style.color = "#25d366";
      sponsorGsmEl.textContent = sponsorInfo[0].gsm;
      document.getElementsByClassName('whatsapp')[0].classList.remove('no-animate');
      whatsappLinkEl.href = `https://wa.me/${sanitizePhoneNumber(sponsorInfo[0].gsm)}`;
    }
    if (sponsorInfo[0].instagram) {
      instagramLinkEl.href = `https://instagram.com/${sponsorInfo[0].instagram}`
      document.getElementsByClassName('instagram')[0].classList.remove('no-animate');
    }
  } else {
    sponsorNameEl.style.color = "#ff0000";
    sponsorNameEl.textContent = "Sponsor bulunamadı";
    sponsorGsmEl.textContent = "-";
  }
});

document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', function (event) {
    if (this.classList.contains('no-animate')) {
      event.preventDefault();
    }
  });
});

formEl.onsubmit = async e => {
  e.preventDefault();
  if (!sponsorInfo.length) {
    alert("Sponsor bulunamadı");
    return;
  }
  const { data, error } = await sb.from("submissions").insert([
    {
      sponsor_id: getSponsorIdFromUrl(),
      full_name: document.getElementById("full_name").value.trim(),
      phone_number: document.getElementById("phone_number").value.trim(),
      address: document.getElementById("address").value.trim()
    }
  ]);

  if (error) console.error("Error inserting data: ", error);
  else {
    alert("Form başarıyla gönderildi.");
    const ersagUrl = "https://www.ersag.com.tr/account.asp?mod=myaccount&sub=edit&action=register&p=2&red=&sponsor=" + getSponsorIdFromUrl();
    window.location = ersagUrl;
  }
};
