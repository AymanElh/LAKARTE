<div class="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🏦 Informations Bancaires
            </h4>
            <div class="space-y-2 text-sm">
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Banque:</span>
                    <span class="text-gray-900 dark:text-gray-100 ml-2">{{ $paymentSetting->bank_name }}</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Titulaire:</span>
                    <span class="text-gray-900 dark:text-gray-100 ml-2">{{ $paymentSetting->account_holder }}</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">RIB:</span>
                    <span class="text-gray-900 dark:text-gray-100 ml-2 font-mono">
                        {{ chunk_split($paymentSetting->rib_number, 4, ' ') }}
                    </span>
                </div>
                @if($paymentSetting->iban)
                    <div>
                        <span class="font-medium text-gray-700 dark:text-gray-300">IBAN:</span>
                        <span class="text-gray-900 dark:text-gray-100 ml-2 font-mono">{{ $paymentSetting->iban }}</span>
                    </div>
                @endif
            </div>
        </div>

        @if($paymentSetting->payment_instructions)
            <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    📋 Instructions
                </h4>
                <div class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ $paymentSetting->payment_instructions }}
                </div>
            </div>
        @endif
    </div>
</div>
