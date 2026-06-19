const HelpCenter = () => {
    return (
        <div className="page">
            <h1>Help Center</h1>

            <button onClick={() => window.open('tel:+91 9381579504')}>
                📞 Call Support
            </button>

            <button onClick={() => window.open('mailto:support@artisan.com')}>
                📧 Email Support
            </button>

            <a href="https://wa.me/919100364726" target="_blank">
                💬 Chat on WhatsApp
            </a>
        </div>
    );
};

export default HelpCenter;