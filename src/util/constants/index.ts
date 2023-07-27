export const CUSTOM_FIELD_GROUP_ID = 348;
export const CREATION_DATE_FIELD_ID = 1671;
export const CUSTOM_FIELD_LAST_LOGIN_ID = 1908;
export const CUSTOM_FIELD_CONTACT_ID = 1670;
export const VAN_ID_KEY_NAME = 'everyActionVanId';

export const fieldDescriptions: { [fieldId: string]: string } = {
  "fld0e4a8rxJH0vuuN": "Resource ID",
  "fldVKCCmxAU8ivmgS": "Content title",
  "fldlOUT8NOFWR7eu4": "Link to content",
  "fldNKdM1u2xGaCisy": "Link to description",
  "fldYoPtenYkBNmtP3": `"About" text`,
  "fldcisSrNS4KSyMqR": "Link to transcript",
  "fldntF05KZMm0UTY5": "Journalist(s) or SME",
  "fldy7rmsL2CDJnAVP": "Journalist or SME organization(s)",
  "fld9onqOwHVbqPLfQ": "Resource type (USE THIS)",
  "fld24UF2TsoWksXwB": "Resource type (recent old)",
  "fld2MMMqUu3Wbxnga": "Only on Checkology",
  "fldHYoFtqOI9smFxf": "Featured in the Sift",
  "fldyEwngEmRoBrzGE": "Format(s)",
  "fldszXbyHzZLewF5b": "Grade level/band",
  "fldQxYib3D0CD1g7A": "Classroom needs",
  "fldZCF1mhfTd0YWUe": "Subject areas",
  "fldIwVRntZnsIBVxO": "NLP standards",
  "fldkwKFB80aSu5S2K": "News literacy topics",
  "fld9YDWlGsSrNjfL5": "Content warnings",
  "fldm4RBxT9KCEERAR": "Content warning to be added to content",
  "fldYYPPNxtMFMl1zo": "Estimated time to complete",
  "fldy33pPzmKoCSYWK": "Evaluation preference",
  "fldXwEIAagskYtoG1": "Assessment types",
  "fldLHarViU5fAPJXF": "Prerequisites/related",
  "flda0vQn27WQfwW2H": "Creation date",
  "fldU0MIlOu2YINjHW": "Date of last review",
  "fldA6oBkZ9Skic5Af": "Date of last modification",
  "fldYjZ1bGZBVI6tNW": "Word wall terms",
  "fldZTkFvGfsYHrJqm": "Word wall terms to link",
  "fld4PHHkb7iY1wP6x": "Media outlets featured",
  "fldzvRYDufuXeQCpy": "Media outlets mentioned",
  "fldGO6oStQQuN0umW": "Checkology overview page complete",
  "fld0a8gyulKMP9PX9": "Learning objectives and essential questions",
  "fldkkXlQiVmOwvekQ": "Audit status",
  "fldhXOrWd97YLbmNq": "Link to audit",
  "fldz0us3vvhG8Mnis": "Status",
  "fldKAkh4bo9K7feAi": "Image status",
  "fldFdhvuA0MOTfga7": "Image group",
  "fldWNUc6cm1DqIFjG": "About text characters",
  "fldYhskMbnN4vdwPM": "Resource type (OLD)",
  "fld7NE4f3jG1ueUcG": "Links to standards alignments",
  "fldqVkHQ1dK407b8P": "Average completion times",
  "fldamyBfrmlxSpR5p": "Searchable tags",
  "fldVOugrqM2a5yUJ7": "User feedback",
  "fldMNk02KM1OqRSq9": "Reporters and SMEs",
  "flduk02p4dO5qbEIx": "NLNO top navigation",
  "fld5zk4552Jh9QJ97": "Why should it go dormant?",
  "fldJT135pdm9vXA9Z": "Checkology points",
  "fldzBAQgpBJWQwJc3": "Name of link",
  "fldZCEM9wKS6XE3rb": "Link to content (2)",
  "fldr4Ujm5ijg47imV": "Name of link (2)",
  "fldLkysrRPKbXuLJW": "Standards alignments",
  "fldZQUS9x1pZBSYot": "Primary image",
  "fld6YyNy29lk0z8nO": "Primary image alt text",
  "fldeA4ZmCCuWrlMwX": "Thumbnail image",
  "fldkyNNsmJg7MRCym": "Thumbnail image alt text",
  "fld92LE4dxStPqXs6": "Social image",
  "fldgIQhKjcgB071qW": "Social image alt text",
  "fldnm7UZaPO6YtVMm": "NewsLitNation exclusive",
  "fld2sDVnNuz3FJtCU": "Design Notes",
  "fldpmmLc5G78WS04r": "Primary image URL",
  "fldCa26yx6aN20Rq1": "Thumbnail image URL",
  "fldjSKk3PtEUDP74q": "URL slug (nlpeducation.org/resources/_____)"
};


export const template = (firstName: string, url: string)=>`
<!DOCTYPE html>
<html lang="en">
​

<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title>
</head>
​

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px;" leftmargin="0">
<table cellspacing="0" border="0" cellpadding="0" width="100%"
style="@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'); font-family: 'Inter', sans-serif;">
<tr>
  <td>
    <table style="background-color: #ffffff; max-width:670px;  margin:0 auto;" width="100%" border="0"
      align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
            style="max-width:670px;background:#fff;padding: 60px 30px;">
            <tr>
              <td style="height:10px;">&nbsp;</td>
            </tr>
            ​
            <tr>
              <td>
                <h3 style="color:#000000;margin:0;">Hi ${firstName} ,</h3>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <p style="color:#000000;font-size:16px;font-weight: 400;line-height:24px;margin:0;">
                  The News Literacy Project is sending you this email because you requested a password reset. Click on this link to create a new password: 
                </p>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <a href=${url} style="background-color:#9013FE;display:inline-block;border-radius:50px;text-decoration:none !important;
                  font-weight:700;font-size:14px;color:#fff;padding:10px 24px;">
                  Set a password
                </a>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <p style="color:#000000;font-size:12px;font-weight: 400;line-height:24px;margin:0;">
                  If you didn’t request a password reset, you can ignore this message. 
                </p>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <p style="color:#000000;font-weight: 400;line-height:24px;margin:0;">
                  <strong style="font-size:14px;">What is my NLP Education account? </strong>
                  <small>
                    Students and independent learners use it to access the Checkology® virtual classroom. Educators use it for Checkology, NewsLitNation® and other News Literacy Project resources.
                  </small> 
                </p>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <p style="color:#000000;margin:0;font-size:14px;font-weight: 600;">
                  Thank You
                </p>
              </td>
            </tr>
            ​
            <tr>
              <td>
                <img width="auto" src="https://nlp-education-resource-media.s3.amazonaws.com/forgot-password-image/NLP+Education+logo+with+tagline.png" title="logo" alt="logo" style="max-width: 100%;">
              </td>
            </tr>
          </table>
        </td>
    </table>
  </td>
</tr>
</table>
</body>
​

</html>`
