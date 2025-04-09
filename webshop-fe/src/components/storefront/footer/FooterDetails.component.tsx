import React from "react";
import {Link} from "react-router-dom";
import {Facebook, Instagram, Twitter} from "lucide-react";
import {usePublicStore} from "../../../hooks/store/usePublicStore";

const FooterDetails: React.FC = () => {
    const {data: store} = usePublicStore()
    return (
        <div className="flex justify-between items-center py-4 px-8 shadow-md">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <h2 className="text-lg font-bold"><Link to={"/"}>{store?.name}</Link></h2>
                    <div className="flex space-x-4">
                        <Link to="/" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                            <Facebook size={24}/>
                        </Link>
                        <Link to="/" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                            <Twitter size={24}/>
                        </Link>
                        <Link to="/" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                            <Instagram size={24}/>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-2">
                    <h2 className="text-lg font-bold">Customer Support</h2>
                    <Link to="/faq" className="hover:underline">
                        FAQ
                    </Link>
                    <Link to="/contact" className="hover:underline">
                        Contact Us
                    </Link>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-2">
                    <h2 className="text-lg font-bold">Information</h2>
                    <p>VAT included in all prices.</p>
                    <p>Minimum order price: ${store?.minOrderPrice}.</p>
                    <p>Returns accepted within {store?.returnPeriod} days.</p>
                </div>
            </div>
        </div>
    );
};

export default FooterDetails;
