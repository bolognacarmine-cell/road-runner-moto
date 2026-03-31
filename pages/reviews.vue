
<template>
  <div class="reviews-page">
    <div class="hero-mini">
      <div class="container">
        <h1>Recensioni Road Runner Moto</h1>
        <p>Le esperienze dei nostri clienti a Capodrise</p>
      </div>
    </div>

    <section class="reviews-list-section">
      <div class="container">
        <div class="reviews-grid">
          <div v-for="(review, index) in reviews" :key="index" class="review-item">
            <ReviewCard 
              :text="review.text" 
              :author="review.author" 
              :avatar="review.avatar" 
            />
          </div>
        </div>

        <div class="cta-google">
          <h2>Vuoi lasciare una recensione?</h2>
          <p>La tua opinione è importante per noi. Racconta la tua esperienza con <strong>moto usate Capodrise</strong> e <strong>concessionaria moto Caserta</strong>.</p>
          <a href="https://www.google.com/search?sca_esv=8d67f07cd29c129e&sxsrf=ANbL-n5NdLrMaFtSNGZy6nYfmWat5rmLWA:1774971793498&q=road+runner+capodrise&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWi4y2BmUQpnz2REyXkSv4Vs5RNsaxXs354nvXSIII8b6yICbt0R6u2npnnWME7J6GZvTko%3D&uds=ALYpb_lx5Hup9BUa31h6AkHudUb2K0KyRs0Tmz30Bubzs8aEHHo283VhvZz8wiaZfZg0pDik2OpUtQb82A2Lga8YiHl-Nt0ysYmrECXYqn5nbhC9OAeA09vuNA8fGLGkk0eGKledaUuY&sa=X&ved=2ahUKEwixkPOZvcqTAxU-8LsIHd3THBUQ3PALegQIGRAE&biw=1536&bih=711&dpr=1.25" target="_blank" rel="noopener noreferrer" class="btn-google">
            <NuxtImg src="/recensioni.jpg" alt="Google" width="20" height="20" class="btn-icon" />
            Lascia una recensione su Google
          </a>
        </div>
      </div>
    </section>

    <!-- Schema Markup JSON-LD -->
    <Head>
      <Title>Recensioni Road Runner Moto | Moto Usate Capodrise</Title>
      <Meta name="description" content="Leggi le recensioni 5 stelle di Road Runner Moto a Capodrise. Scopri cosa dicono i nostri clienti su moto usate, assistenza e finanziamenti a Caserta." />
      <Script type="application/ld+json">
        {{ JSON.stringify(schemaMarkup) }}
      </Script>
    </Head>
  </div>
</template>

<script setup>
import ReviewCard from '~/components/home/ReviewCard.vue'

const reviews = [
  { text: "Pasquale esperto, moto perfetta!", author: "Marco", avatar: "" },
  { text: "Assistenza top, Honda usata ok!", author: "Luca", avatar: "" },
  { text: "Finanziamento veloce", author: "Anna", avatar: "" },
  { text: "Piaggio nuovo, servizio eccellente", author: "Giovanni", avatar: "" },
  { text: "Consiglio Road Runner!", author: "Fabio", avatar: "" }
]

const schemaMarkup = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Moto Usate Capodrise - Road Runner Moto",
  "image": "https://road-runner.it/logo-road-runner.jpg",
  "description": "Concessionaria moto nuove e usate a Capodrise (CE). Specialisti in moto usate Caserta.",
  "brand": {
    "@type": "Brand",
    "name": "Road Runner Moto"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "125"
  },
  "review": reviews.map(r => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": r.author
    },
    "reviewBody": r.text
  }))
}
</script>

<style scoped>
.reviews-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
}

.hero-mini {
  padding: 8rem 0 4rem;
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/cta-bg.jpg') center/cover;
  text-align: center;
}

.hero-mini h1 {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #d4af37;
}

.hero-mini p {
  font-size: 1.25rem;
  color: #888;
}

.reviews-list-section {
  padding: 5rem 0;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
}

.cta-google {
  background: #111;
  padding: 4rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #333;
}

.cta-google h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta-google p {
  color: #888;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-google {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #4285F4;
  color: #fff;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.btn-icon {
  border-radius: 4px;
  object-fit: cover;
}

.btn-google:hover {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 133, 244, 0.4);
}

@media (max-width: 768px) {
  .hero-mini h1 {
    font-size: 2.5rem;
  }
}
</style>
