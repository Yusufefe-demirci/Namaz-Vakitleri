// Gerçek zamanlı saat gösterme
function updateClock() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  setInterval(updateClock, 1000);
  updateClock();
  
  // API'den Ankara için namaz vakitlerini çekme
  document.addEventListener('DOMContentLoaded', () => {
    const prayerTimesDiv = document.getElementById('prayer-times');
    const nextPrayerName = document.getElementById('next-prayer-name');
    const timeLeft = document.getElementById('time-left');
  
    // API isteği
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Ankara&country=Turkey&method=13')
      .then(response => response.json())
      .then(data => {
        const timings = data.data.timings;
  
        // Namaz vakitlerini ekrana yazdırma
        const prayerTimes = [
          { name: 'İmsak', time: timings.Imsak },
          { name: 'Güneş', time: timings.Sunrise },
          { name: 'Öğle', time: timings.Dhuhr },
          { name: 'İkindi', time: timings.Asr },
          { name: 'Akşam', time: timings.Maghrib },
          { name: 'Yatsı', time: timings.Isha }
        ];
  
        prayerTimes.forEach(prayer => {
          const div = document.createElement('div');
          div.innerHTML = `
            <span>${prayer.name}</span>
            <span>${prayer.time}</span>
          `;
          prayerTimesDiv.appendChild(div);
        });
  
        // Sonraki namaz vaktini ve kalan süreyi hesaplama
        function calculateNextPrayer() {
          const now = new Date();
          let nextPrayer = null;
          let timeDifference = Infinity;
  
          prayerTimes.forEach(prayer => {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0, 0);
  
            if (prayerTime > now && prayerTime - now < timeDifference) {
              nextPrayer = prayer;
              timeDifference = prayerTime - now;
            }
          });
  
          if (nextPrayer) {
            nextPrayerName.textContent = nextPrayer.name;
            const [hours, minutes] = nextPrayer.time.split(':').map(Number);
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0, 0);
  
            const diffMs = prayerTime - now;
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
  
            timeLeft.textContent = `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
          } else {
            nextPrayerName.textContent = 'Yarınki İmsak';
            timeLeft.textContent = 'Bilgi yükleniyor...';
          }
        }
  
        setInterval(calculateNextPrayer, 1000);
        calculateNextPrayer();
      })
      .catch(error => {
        console.error('API Hatası:', error);
        prayerTimesDiv.innerHTML = '<p>Veriler yüklenirken bir hata oluştu.</p>';
      });
  });