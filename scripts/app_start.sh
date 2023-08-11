#!/bin/bash
PRO_PM_DIR="/home/education-backend"

echo "call nvm shell"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

#  run api

echo "INSTALL PM2.........."

if [ -d "$HOME/.pm2" ]; then
  echo "pm2 is exits"
else
  echo "pm2 is installing"
  npm i -g pm2
fi

echo "installing log dump appliation"
pm2 install pm2-cloudwatch
# These need to be moved to env varibales most likely
pm2 set pm2-cloudwatch:logGroupName NewsLitBackEnd
pm2 set pm2-cloudwatch:logStreamName NewsLitBackEndStream
pm2 set pm2-cloudwatch:awsRegion us-east-1

echo "Moving to backend folder.........."
cd $PRO_PM_DIR
pmw
ls -la

export NODE_ENV=local
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=adminstagingeducation#123
export POSTGRES_DB=staging-education
export PGADMIN_DEFAULT_EMAIL=khalid.rasool@kwanso.com
export PGADMIN_DEFAULT_PASSWORD=adminstagingeducation#123


export AWS_REGION=us-east-1
export AWS_VERSION=latest
export AWS_ACCESS_KEY_ID=AKIAT2XBNJHIPO3CSV6E
export AWS_SECRET_ACCESS_KEY=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

# USER POOL => NLP-dev
# AWS_USER_POOL_ID=us-east-1_iBb7CJZGw #NLP-dev 
# AWS_CLIENT_ID=7vjo3a47a88j9vjqkma45jlnnv # NLP-dev client
# AWS_CLIENT_SECRET=o7e2uc7vqeq91rgg2bggns5665m7nunq2jmnnqdrneaks4f2ue4 # NLP-dev client

# USER POOL => NLP-dev
# AWS_USER_POOL_ID=us-east-1_6jSvHxjPR #NLP-dev-2
# AWS_CLIENT_ID=566mqu1h01nfifdpqo7plcuepf # NLP-dev-2 client
# AWS_CLIENT_SECRET=1q8ml84q151s1po8f0809rjpqcba20eke2821mbhgegh7f485c5i # NLP-dev-2 client 

# USER POOL => EP-userpool
# export AWS_USER_POOL_ID=us-east-1_1DJDHHpXt
# export AWS_CLIENT_ID=2q6cib7sare0o5oh5bp0m7rmpk
# export AWS_CLIENT_SECRET=106uvs1pgp8a3vve53i9i68em8eetl65v84mojop6ufv6uoir3ed

# USER POOL => userpool-11-aug-2023
export AWS_USER_POOL_ID=us-east-1_Rc6kHBCO8
export AWS_CLIENT_ID=3lmer2a62q8l2thvmr1j615li9
export AWS_CLIENT_SECRET=10nc1kv4mn6vmadlu670crco9a53rgt2dnm80rqst7eigsevvqke

export EVERYACTION_API_URL=https://api.securevan.com
export EVERYACTION_APP_NAME=ea002.newsliteracyproject.api
export EVERYACTION_API_KEY=aa4edb74-83e6-336a-548a-509eacab1e88|1
export EVERYACTION_EDUCATOR_ACTIVIST_CODE_ID=4537635
export EVERYACTION_NEWSLETTER_ACTIVIST_CODE_ID=4507252
export EVERYACTION_NEWSLETTER_PUBLIC_ACTIVIST_CODE_ID=4507247
export EVERYACTION_SIFT_ACTIVIST_CODE_ID=4507252
export EVERYACTION_NLN_INSIDER_ACTIVIST_CODE_ID=4537703
export EVERYACTION_GRADE_3_5_ACTIVIST_CODE_ID=4708526
export EVERYACTION_GRADE_6_8_ACTIVIST_CODE_ID=4409616
export EVERYACTION_GRADE_9_12_ACTIVIST_CODE_ID=4409511
export EVERYACTION_GRADE_HIGHER_ACTIVIST_CODE_ID=4409617
export EVERYACTION_GRADE_OTHER_ACTIVIST_CODE_ID=5104941
export EVERYACTION_SUBJECT_ARTS_ACTIVIST_CODE_ID=4409545
export EVERYACTION_SUBJECT_ELA_ACTIVIST_CODE_ID=4409541
export EVERYACTION_SUBJECT_JOURNALISM_ACTIVIST_CODE_ID=4463300
export EVERYACTION_SUBJECT_LIBRARY_MEDIA_ACTIVIST_CODE_ID=4409532
export EVERYACTION_SUBJECT_SOCIAL_STUDIES_ACTIVIST_CODE_ID=4409536
export EVERYACTION_SUBJECT_STEM_ACTIVIST_CODE_ID=4409537
export EVERYACTION_SUBJECT_OTHER_ACTIVIST_CODE_ID=5104942

#Airtable
export AT_SECRET_API_TOKEN=pattaflwZulpZiCa9.1bdf0596625ad298baf5a1471cf20f797bc202c4e87b3b8b1a172b45374290ef     #patKfSxpUp205nXiQ.3c6c17fd1d0ce052a6d425a51f97ed696783c52cc7704a52b84ed4cedb827e1e #Personal_AccessToken
export AT_BASE_ID=app1hZd1AL5fS9F7y #baseId like app....
export AT_TABLE_ID=tblgigCmS7C2iPCkm #tableId like tbl
export NEW_RECORD_WEB_HOOK_ID = achIRaLfA8hXpoc7J #achNSxltJePNRgl10 -jordan
export DELETED_RECORD_WEB_HOOK_ID =ach9J0CJTosMUhP9t #achHiQrhGqJhFriL6 -jordan
export UPDATE_RECORD_WEB_HOOK_ID =achw3cqQRFHd1k0go #achZb8ciAmLdRcPSH -jordan
export WEB_HOOK_BASE_URL = https://api.airtable.com/v0/bases
export GET_RECORD_BASE_URL = https://api.airtable.com/v0

#Airtable Educater Content default
export AT_EDUCATOR_BASE_ID= appOcYRraQnayd6Lx #appXyndHFfhmWIbpi #baseId like app....
export AT_EDUCATOR_TABLE_ID= tblqz3wNW2BL0qw1P #tblV2HXxmjdCYGAxY #tableId like tbl

#SendGrid
export SENDGRID_API_KEY=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
export FROM_EMAIL=arslan.ahmad@kwanso.com
export TEMPLATE_ID=d-e0977f81851545ea95811144f55c411a
export TEMPLATE_NAME=ResetEmailTemplate

# stop the backend if its already running
pm2 stop education-backend 

echo "Starting backend with pm2 .........."
pm2 start "app.json"

echo "Started backend with pm2  successfully.........."

#  save pm2 processes
pm2 save
