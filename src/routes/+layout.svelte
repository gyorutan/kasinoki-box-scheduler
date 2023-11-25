<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
</script>

<div class="layout max-w-[768px] min-w-[375px] min-h-screen m-auto">
	<Navbar />
	<main class="py-[40px]"><slot /></main>
	<Footer />
</div>
