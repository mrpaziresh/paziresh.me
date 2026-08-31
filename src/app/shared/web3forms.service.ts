import { Injectable } from '@angular/core';

// Get a free access key at https://web3forms.com (emailed instantly, no account needed)
// and paste it below. Submissions get emailed straight to the address you registered.
const WEB3FORMS_ACCESS_KEY = '5cd40b77-c33b-4190-87cb-af457c8c4dfe';

@Injectable({ providedIn: 'root' })
export class Web3FormsService {
  async submit(payload: Record<string, string>): Promise<boolean> {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...payload }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  }
}
