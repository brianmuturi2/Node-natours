// updateData
import axios from 'axios';

// id is tour id
export const checkOut = async (tourId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    });

    // redirect to checkout form if successful
    if (res.data.status === 'success') {
      window.open(`${res.data.session.url}`, '_blank');
      //location.assign(`${res.data.session.url}`);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
}
