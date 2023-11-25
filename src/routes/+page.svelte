<script lang="ts">
	import { getThreeWeeks } from '$lib/getThreeWeeks';
	import { onMount } from 'svelte';

	interface Reservations {
		id: string;
		name: string;
		date: string;
		time: string;
	}

	let reservations: Reservations[] = [];

	let threeWeeks: string[] = [];

	let openModal: boolean = false;

	let reservationId: string = '';

	let password: string = '';

	let isLoading: boolean = false;

	const getReservations = async () => {
		const response = await fetch('/api/reserve');
		const resultData = await response.json();
		reservations = resultData.reservations;
	};

	onMount(async () => {
		getReservations();
		threeWeeks = getThreeWeeks();
	});

	const handleDelete = async () => {
		isLoading = true;
		try {
			const response = await fetch(`/api/reserve/${reservationId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(password)
			});

			const resultData = await response.json();

			if (resultData.success) {
				alert('削除しました');
				openModal = false;
				password = '';
				getReservations();
			} else {
				alert('パスワードが一致しません');
				password = '';
			}

			isLoading = false;
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="flex flex-col justify-center items-center p-5">
	<div class="grid grid-cols-1 gap-2.5 w-full">
		{#each threeWeeks as threeWeek}
			<div class="border-[1px] border-gray-400 rounded-md shadow-sm">
				<p class="text-center font-medium py-1 text-black border-b border-slate-300">{threeWeek}</p>
				<div class="py-1 px-2">
					{#each reservations.filter((reservation) => reservation.date === threeWeek) as reservation}
						<div class="flex justify-between items-center px-2 py-0.5">
							<div class="font-bold">{reservation.time}</div>
							<div class="font-black text-blue-500 pr-16 text-base">{reservation.name}</div>
							<button
								class="hover:bg-red-200 p-2 rounded-full"
								type="button"
								on:click={() => {
									if (openModal) {
										openModal = false;
									} else {
										openModal = true;
									}
									reservationId = reservation.id;
									console.log(reservationId);
								}}><img class="" src="/delete1.png" alt="delete" height="20" width="20" /></button
							>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div>読み込み中...</div>
		{/each}
	</div>
</div>
{#if openModal}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full justify-center p-4 text-center items-center">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pb-2 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
							>
								<svg
									class="h-6 w-6 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
							</div>
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
									予約削除
								</h3>
								<div class="relative w-full mt-4">
									<label for="password" class="absolute left-3 top-2 font-base text-black text-sm">
										パスワード
									</label>
									<input
										bind:value={password}
										name="password"
										required
										type="password"
										class="tracking-[5px] hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							on:click={handleDelete}
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
						>
							{#if isLoading}
								削除中。。。
							{:else}
								削除
							{/if}
						</button>
						<button
							on:click={() => {
								if (openModal) {
									openModal = false;
								} else {
									openModal = true;
								}
								password = '';
							}}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							>戻る</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
