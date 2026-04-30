import random, csv
from collections import defaultdict

random.seed(42)

campaigns = ['Summer Reset', 'Weekend Escape', 'Sea, Pool, Repeat', 'Room With A View', 'Snorkel Morning']
ad_sets = {
    'Summer Reset': 'Couples 25-45', 'Weekend Escape': 'Leisure 28-50',
    'Sea, Pool, Repeat': 'Families 30-48', 'Room With A View': 'Luxury 35-55', 'Snorkel Morning': 'Divers 22-40'
}
angles = ['Pool-to-Sea', 'Morning Calm', 'Couple Escape', 'Resort Beauty', 'Snorkeling First Shot']

ts_params = {
    'Pool-to-Sea':           (0.44, 0.035, 0.36, 0.52),
    'Morning Calm':          (0.31, 0.035, 0.22, 0.40),
    'Couple Escape':         (0.36, 0.035, 0.27, 0.45),
    'Resort Beauty':         (0.25, 0.035, 0.16, 0.34),
    'Snorkeling First Shot': (0.38, 0.12,  0.16, 0.58),
}
ctr_params = {
    'Pool-to-Sea':           (0.028, 0.004),
    'Morning Calm':          (0.020, 0.003),
    'Couple Escape':         (0.023, 0.004),
    'Resort Beauty':         (0.016, 0.003),
    'Snorkeling First Shot': (0.025, 0.007),
}
saves_per_10k = {
    'Pool-to-Sea':           (60, 10),
    'Morning Calm':          (38, 8),
    'Couple Escape':         (46, 9),
    'Resort Beauty':         (24, 6),
    'Snorkeling First Shot': (50, 16),
}

dates = ['2026-03-03','2026-03-10','2026-03-17','2026-03-24','2026-03-31','2026-04-07','2026-04-14']

meta_rows = []
for camp in campaigns:
    for angle in angles:
        n = random.randint(2, 3)
        for d in random.sample(dates, n):
            spend = round(random.uniform(900, 3800))
            cpm = round(random.uniform(38, 72), 1)
            impressions = int(spend / cpm * 1000)
            reach = int(impressions * random.uniform(0.83, 0.93))
            ts_mean, ts_std, ts_lo, ts_hi = ts_params[angle]
            ts = round(min(ts_hi, max(ts_lo, random.gauss(ts_mean, ts_std))), 3)
            ctr_mean, ctr_std = ctr_params[angle]
            ctr = round(max(0.008, random.gauss(ctr_mean, ctr_std)), 4)
            clicks = int(impressions * ctr)
            v3s = int(impressions * ts)
            v25 = int(v3s * random.uniform(0.68, 0.82))
            v100 = int(v25 * random.uniform(0.42, 0.62))
            s_mean, s_std = saves_per_10k[angle]
            saves = int(max(20, random.gauss(s_mean, s_std) * impressions / 10000))
            shares = int(saves * random.uniform(0.28, 0.42))
            comments = int(saves * random.uniform(0.10, 0.18))
            meta_rows.append([d, camp, ad_sets[camp], angle, int(spend), impressions, reach,
                               cpm, round(ctr*100,2), round(ts*100,1),
                               v3s, v25, v100, saves, shares, comments, clicks])

meta_rows.sort(key=lambda r: r[0])
meta_header = ['Date','Campaign_Name','Ad_Set','Creative_Angle','Spend','Impressions','Reach',
               'CPM','CTR','Thumbstop_Rate','Video_Views_3s','Video_Views_25','Video_Views_100',
               'Saves','Shares','Comments','Clicks']

with open('assets/demos/meta_campaigns_q2_2026.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(meta_header)
    w.writerows(meta_rows)
print(f"Meta CSV: {len(meta_rows)} rows")

# ---- TIKTOK ----
random.seed(43)
tt_camps = ['Summer Reset', 'Weekend Escape', 'Sea, Pool, Repeat', 'Room With A View', 'Snorkel Morning']
tt_groups = {
    'Summer Reset': 'Travel Intent 22-38', 'Weekend Escape': 'Leisure 25-45',
    'Sea, Pool, Repeat': 'Families 28-48', 'Room With A View': 'Luxury 30-55', 'Snorkel Morning': 'Outdoor 20-38'
}
hooks = ['POV Vacation', 'Fast Reveal', 'Creator Intro', 'Pool-to-Sea', 'Snorkeling First Shot']
styles = ['UGC Creator', 'Cinematic', 'Voiceover', 'Selfie Walkthrough']

base_ctr = {'POV Vacation':0.058,'Fast Reveal':0.042,'Creator Intro':0.052,'Pool-to-Sea':0.038,'Snorkeling First Shot':0.048}
base_wt  = {'POV Vacation':9.8,'Fast Reveal':7.2,'Creator Intro':10.4,'Pool-to-Sea':11.2,'Snorkeling First Shot':11.8}
base_cr  = {'POV Vacation':0.42,'Fast Reveal':0.34,'Creator Intro':0.46,'Pool-to-Sea':0.48,'Snorkeling First Shot':0.44}
ctr_j = {'UGC Creator':1.10,'Cinematic':0.75,'Voiceover':0.92,'Selfie Walkthrough':1.05}
wt_j  = {'UGC Creator':0.88,'Cinematic':1.55,'Voiceover':1.12,'Selfie Walkthrough':0.90}
cr_j  = {'UGC Creator':0.90,'Cinematic':1.30,'Voiceover':1.10,'Selfie Walkthrough':0.85}

tt_dates = ['2026-03-05','2026-03-12','2026-03-19','2026-03-26','2026-04-02','2026-04-09','2026-04-16']
tt_rows = []

for camp in tt_camps:
    for hook in hooks:
        style_choices = random.sample(styles, random.randint(2, 3))
        for style in style_choices:
            for d in random.sample(tt_dates, random.randint(2, 3)):
                spend = round(random.uniform(600, 3200))
                cpm = round(random.uniform(28, 62), 1)
                impressions = int(spend / cpm * 1000)
                ctr = base_ctr[hook] * ctr_j[style]
                wt  = base_wt[hook]  * wt_j[style]
                cr  = base_cr[hook]  * cr_j[style]
                if hook == 'Snorkeling First Shot' and random.random() < 0.40:
                    ctr *= 0.45; wt *= 0.55; cr *= 0.50
                ctr = round(max(0.012, random.gauss(ctr, ctr*0.12)), 4)
                wt  = round(max(3.0,   random.gauss(wt,  wt*0.10)),  1)
                cr  = round(min(0.82, max(0.15, random.gauss(cr, cr*0.10))), 3)
                v2s = int(impressions * random.uniform(0.55, 0.75))
                v6s = int(impressions * cr * random.uniform(0.65, 0.85))
                clicks = int(impressions * ctr)
                shares = int(impressions * random.uniform(0.003, 0.009))
                comments = int(shares * random.uniform(0.35, 0.75))
                tt_rows.append([d, camp, tt_groups[camp], hook, style, int(spend),
                                 impressions, cpm, round(ctr*100,2),
                                 v2s, v6s, round(wt,1), round(cr*100,1),
                                 shares, comments, clicks])

tt_rows.sort(key=lambda r: r[0])
tt_header = ['Date','Campaign_Name','Ad_Group','Hook_Type','Creator_Style','Spend','Impressions',
             'CPM','CTR','Views_2s','Views_6s','Avg_Watch_Time','Completion_Rate','Shares','Comments','Clicks']

with open('assets/demos/tiktok_campaigns_q2_2026.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(tt_header)
    w.writerows(tt_rows)
print(f"TikTok CSV: {len(tt_rows)} rows")

# Print aggregates for chart hardcoding
print("\n--- META by Creative_Angle ---")
agg = defaultdict(lambda: {'ts':[],'saves':[],'ctr':[]})
for r in meta_rows:
    agg[r[3]]['ts'].append(r[9]); agg[r[3]]['saves'].append(r[13]); agg[r[3]]['ctr'].append(r[8])
for a in angles:
    v = agg[a]
    print(f"  {a}: ts={sum(v['ts'])/len(v['ts']):.1f} saves={sum(v['saves'])/len(v['saves']):.0f} ctr={sum(v['ctr'])/len(v['ctr']):.2f}")

print("\n--- TIKTOK by Hook_Type ---")
agg2 = defaultdict(lambda: {'wt':[],'cr':[],'ctr':[]})
for r in tt_rows:
    agg2[r[3]]['wt'].append(r[11]); agg2[r[3]]['cr'].append(r[12]); agg2[r[3]]['ctr'].append(r[8])
for h in hooks:
    v = agg2[h]
    print(f"  {h}: wt={sum(v['wt'])/len(v['wt']):.1f} cr={sum(v['cr'])/len(v['cr']):.1f} ctr={sum(v['ctr'])/len(v['ctr']):.2f}")
