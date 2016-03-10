'use strict';

var config = new function() {
    this.mysqlconnection = {
        verioninfo: 'Release v1.0 / Build 10-02-2014',
        host: 'lms.valiantica.com',
        user: 'tao',
        password: 'Valianticano1',
        database: 'vdb1',
        /*host: '173.194.105.149',
         user: 'root',
         password: 'Valianticano1',
         database: 'vdb1',
         connectionLimit: 5*/
    }

    this.serversetting = {
        mailserver: "defaultmail",
        //mailserver: "gmail",
        default_sender_mail: "admin@denalijs.io",
        default_sender_name: "denaliJS Admin"
    }

    this.gmail = {
        mail_user: "tao_l@valiantica.com",
        mail_clientId: "72606887906-l72v7an9rtjsif1vvs2lnbaqvprog2hh.apps.googleusercontent.com",
        mail_clientSecret: "jOLJw_KHpgwohqqLXZE2F_2D",
        mail_refreshToken: "1/8eHeCzNLxnLZjjQdck2WWHPPfteeELS3hLefTWpQkqI",
        mail_accessToken: "ya29.mAAMslglVQzsuQHqU8E74Pg48Ove4SF3ZICQKtEffVF6BCl8zjfhYnWw",
        mail_timeout: 3600
    }

    this.defaultmail = {
        /*mail_host: 'in-v3.mailjet.com',
        mail_port: 25,
        mail_authentication: true,
        mail_server_user: "7a426fa2f3040f2ae6827a6f50171a78",
        mail_server_pass: "b953f57c47e9623df07c5c50106c6a4b"*/
        
        /*mail_host: 'smtp.sendgrid.net',
        mail_port: 587,
        mail_authentication: true,
        mail_server_user: "tao_l_v",
        mail_server_pass: "litao1688"*/
        
        
        mail_host: 'smtp.mandrillapp.com',
        mail_port: 587,
        mail_authentication: true,
		mail_server_user: "admin@denalijs.io",
        mail_server_pass: "NLjljSmgxB6Z_rYNpbwoWw"
        //mail_server_user: "tao_l@valiantica.com",
        //mail_server_pass: "zL9ko-xU9AA7VxHV28vIvQ"
        
    }
}
//Export singleton config object;
module.exports = config;