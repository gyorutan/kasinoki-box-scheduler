<script>
	import { page } from '$app/stores';
</script>

<div class="fixed flex justify-between bottom-0 w-full max-w-[768px] min-w-[375px] m-auto">
	<a
		href="/"
		class={$page.url.pathname === '/'
			? 'w-full flex justify-center bg-indigo-600 p-2'
			: 'w-full flex justify-center bg-green-600 p-2'}
	>
		<span class="text-white text-base font-bold">予約状況</span>
	</a>
	<a
		href="/reserve"
		class={$page.url.pathname === '/reserve'
			? 'w-full flex justify-center bg-indigo-600 p-2'
			: 'w-full flex justify-center bg-green-600 p-2'}
	>
		<span class="text-white text-base font-bold">予約する</span>
	</a>
</div>
