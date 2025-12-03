2. Cara Pakai untuk Combobox Status

Ganti kode lama combobox menjadi seperti ini:

<Dropdown
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
  placeholder="-- Pilih Status --"
/>


✨ Selesai!
Sekarang combobox status otomatis mengambil data dari backend.

🟩 3. Cara Pakai untuk Combobox Role (misal)
<Dropdown
  v-model="form.role_id"
  label="Role"
  url="/master/combo-role"
  label-field="role_name"
  value-field="id"
/>

🟨 4. Jika ingin pakai data statis
<Dropdown
  v-model="form.gender"
  label="Jenis Kelamin"
  :items="[
    { id: 'L', name: 'Laki-laki' },
    { id: 'P', name: 'Perempuan' }
  ]"
/>

🟧 5. Pakai di file Anda → ModulePage.vue

Import:

import Dropdown from "../components/Dropdown.vue";


Pakai di template:

<Dropdown
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
/>

🎉 DONE

Dengan ini, semua combobox di aplikasi Anda kini:

✔ Konsisten
✔ Mudah dipakai ulang
✔ Rapi
✔ Bisa load dari API atau array statis


Cara Pakai Select2.vue
<Select2
  v-model="form.id_status"
  label="Status"
  url="/master/combo-status"
  label-field="status_name"
  value-field="id"
/>

Cara Pakai MultiSelect.vue
Contoh untuk memilih banyak role:
<MultiSelect
  v-model="form.role_ids"
  label="Pilih Role"
  url="/master/combo-role"
  label-field="role_name"
  value-field="id"
/>


👍 Output form.role_ids akan menjadi:

[1, 3, 5]

🎉 SEKARANG ANDA PUNYA 3 KOMPONEN REUSABLE
Komponen	Tipe	Fitur
Dropdown.vue	Single	Simple combobox
Select2.vue	Single (Searchable)	Mirip Select2 jQuery
MultiSelect.vue	Multiple	Searchable, badge, multiselect

Semua sudah:
✔ Dinamis dari API
✔ Bisa pakai array
✔ Reusable di semua module