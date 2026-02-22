export default async function generateReferralCode(prisma: any, length = 10) {
    while (true) {
        const code =  Math.random().toString(36).substring(2, 2 + length).toUpperCase();

        const exist = await prisma.user.findUnique({
            where: { referralCode: code },
        });

        if (!exist) return code;
    }
}