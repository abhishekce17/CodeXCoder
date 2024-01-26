import toast from 'react-hot-toast';
export const notify = (msg, status) => {
    toast[status](msg,
        {
            duration: 2500,
            iconTheme: {
                primary: '#013d29',
                secondary: '#fff',
            }
        });
}