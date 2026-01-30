import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" />
            <path d="M3.5 10.36V16.36C3.5 16.36 7 19.36 12 19.36C17 19.36 20.5 16.36 20.5 16.36V10.36L12 15L3.5 10.36Z" />
        </svg>
    );
}
