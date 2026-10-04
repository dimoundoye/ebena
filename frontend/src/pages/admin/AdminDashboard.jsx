import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  CircleCheck,
  CircleDot,
  CircleX,
  Clock3,
  Download,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MailOpen,
  Newspaper,
  RefreshCw,
  Search,
  Store,
  Trash2,
  Users,
} from 'lucide-react';
import { api, apiUrl } from '../../lib/api.js';
import { useDocumentMeta } from '../../lib/useDocumentMeta.js';
import { formatPrix, INTERETS, JOURS, PACKS, PAVILLONS, PROFILS, SUJETS } from '../../data/site.js';
import './admin.css';

const STATUTS = [
  { value: 'nouveau', label: 'Nouveau', icon: CircleDot },
  { value: 'en_cours', label: 'En cours', icon: Clock3 },
  { value: 'confirme', label: 'Confirmé', icon: CircleCheck },
  { value: 'annule', label: 'Annulé', icon: CircleX },
];

const label = (list, value, key = 'value') => list.find((item) => item[key] === value)?.label || value;
const packName = (id) => PACKS.find((pack) => pack.id === id)?.name || id;
const pavillonName = (slug) => (slug === 'indecis' ? 'À définir' : PAVILLONS.find((p) => p.slug === slug)?.short || slug);
const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' }) : '';
const formatNumber = (value) => Number(value || 0).toLocaleString('fr-FR');

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Requête authentifiée : renvoie vers la connexion si la session a expiré.
function useAdminApi() {
  const navigate = useNavigate();
  return useCallback(
    async (path, options) => {
      try {
        return await api(path, options);
      } catch (err) {
        if (err.status === 401) navigate('/admin/login', { replace: true });
        throw err;
      }
    },
    [navigate]
  );
}

function useAdminList(resource, query) {
  const request = useAdminApi();
  const [state, setState] = useState({ items: [], loading: true, error: '' });
  const [version, setVersion] = useState(0);
  const qs = new URLSearchParams(Object.entries(query).filter(([, value]) => value !== '' && value !== undefined)).toString();

  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true }));
    request(`/admin/${resource}${qs ? `?${qs}` : ''}`, { signal: controller.signal })
      .then((data) => setState({ items: data.items, loading: false, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ items: [], loading: false, error: err.message });
      });
    return () => controller.abort();
  }, [request, resource, qs, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const update = useCallback((fn) => setState((current) => ({ ...current, items: fn(current.items) })), []);
  return { ...state, qs, reload, update };
}

/* --- Éléments d'interface ------------------------------------------------------------------ */

function PageHead({ title, subtitle, children }) {
  return (
    <header className="admin-head">
      <div>
        <h1 className="admin-head__title">{title}</h1>
        {subtitle && <p className="admin-head__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="admin-head__actions">{children}</div>}
    </header>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="admin-search">
      <Search aria-hidden="true" />
      <span className="sr-only">Rechercher</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function FilterSelect({ value, onChange, options, allLabel, ariaLabel }) {
  return (
    <select className="admin-select" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ExportLink({ resource, qs }) {
  return (
    <a className="admin-button" href={apiUrl(`/admin/export/${resource}${qs ? `?${qs}` : ''}`)}>
      <Download aria-hidden="true" /> Exporter (CSV)
    </a>
  );
}

function StatusBadge({ value }) {
  const statut = STATUTS.find((item) => item.value === value) || STATUTS[0];
  const IconComponent = statut.icon;
  return (
    <span className={`status status--${statut.value}`}>
      <IconComponent aria-hidden="true" /> {statut.label}
    </span>
  );
}

function ListState({ loading, error, empty, count }) {
  if (error) return <p className="admin-empty admin-empty--error">{error}</p>;
  if (loading && !count) return <p className="admin-empty">Chargement…</p>;
  if (!count) return <p className="admin-empty">{empty}</p>;
  return null;
}

// Barres horizontales d'une seule série : valeur au bout de la barre, libellés en couleur de texte.
function BarList({ items }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <ul className="bars">
      {items.map((item) => (
        <li key={item.label} className="bars__row">
          <span className="bars__label">{item.label}</span>
          <span className="bars__track">
            <span
              className="bars__fill"
              style={{ width: `${(item.value / max) * 100}%` }}
              data-tip={`${item.label} : ${formatNumber(item.value)}${item.detail ? ` (${item.detail})` : ''}`}
            />
          </span>
          <span className="bars__value">
            {formatNumber(item.value)}
            {item.detail && <small> · {item.detail}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* --- Vue d'ensemble ------------------------------------------------------------------------- */

function Overview() {
  const request = useAdminApi();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    request('/admin/stats')
      .then((data) => {
        setStats(data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [request]);

  useEffect(load, [load]);

  if (error) return <p className="admin-empty admin-empty--error">{error}</p>;
  if (!stats) return <p className="admin-empty">Chargement…</p>;

  const { totals } = stats;
  const tiles = [
    { label: 'Demandes de stand', value: formatNumber(totals.reservations), detail: `${totals.reservations_nouvelles} à traiter`, to: 'reservations', icon: Store },
    {
      label: 'Chiffre d’affaires confirmé',
      value: `${formatPrix(stats.chiffreAffaires.confirme)} HT`,
      detail: `sur ${formatPrix(stats.chiffreAffaires.potentiel)} HT demandés (hors annulations)`,
      to: 'reservations',
      icon: CircleCheck,
    },
    { label: 'Inscriptions visiteurs', value: formatNumber(totals.inscriptions), detail: 'pré-inscriptions', to: 'inscriptions', icon: Users },
    { label: 'Messages non lus', value: formatNumber(totals.messages_non_lus), detail: `sur ${totals.messages} reçus`, to: 'messages', icon: Inbox },
    { label: 'Abonnés newsletter', value: formatNumber(totals.newsletter), detail: 'adresses e-mail', to: 'newsletter', icon: Newspaper },
  ];

  return (
    <>
      <PageHead title="Vue d’ensemble" subtitle="Suivi des demandes et inscriptions d’ÉBËNA 2027.">
        <button type="button" className="admin-button" onClick={load}>
          <RefreshCw aria-hidden="true" /> Actualiser
        </button>
      </PageHead>

      <div className="tiles">
        {tiles.map(({ label: tileLabel, value, detail, to, icon: IconComponent }) => (
          <Link key={tileLabel} to={to} className="tile">
            <span className="tile__label">
              <IconComponent aria-hidden="true" /> {tileLabel}
            </span>
            <span className="tile__value">{value}</span>
            <span className="tile__detail">{detail}</span>
          </Link>
        ))}
      </div>

      <div className="admin-panels">
        <section className="admin-panel">
          <h2 className="admin-panel__title">Demandes de stand par pack</h2>
          <BarList
            items={PACKS.map((pack) => ({
              label: `Pack ${pack.name}`,
              value: stats.packs[pack.id]?.total || 0,
              detail: `${stats.packs[pack.id]?.confirmes || 0} confirmée(s)`,
            }))}
          />
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">Visiteurs attendus par jour</h2>
          <BarList items={stats.inscriptionsParJour.map((row) => ({ label: label(JOURS, row.jour), value: row.total }))} />
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">Profils des visiteurs</h2>
          {stats.inscriptionsParProfil.length ? (
            <BarList items={stats.inscriptionsParProfil.map((row) => ({ label: label(PROFILS, row.profil), value: row.total }))} />
          ) : (
            <p className="admin-empty">Aucune inscription pour le moment.</p>
          )}
        </section>
      </div>

      <div className="admin-panels admin-panels--two">
        <section className="admin-panel">
          <h2 className="admin-panel__title">Dernières demandes de stand</h2>
          {stats.recentReservations.length ? (
            <ul className="recent">
              {stats.recentReservations.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.entreprise}</strong>
                    <span>
                      Pack {packName(item.pack)} · {formatDate(item.created_at)}
                    </span>
                  </div>
                  <StatusBadge value={item.statut} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">Aucune demande pour le moment.</p>
          )}
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">Derniers messages</h2>
          {stats.recentMessages.length ? (
            <ul className="recent">
              {stats.recentMessages.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.nom}</strong>
                    <span>
                      {label(SUJETS, item.sujet)} · {formatDate(item.created_at)}
                    </span>
                  </div>
                  {!item.lu && <span className="status status--nouveau">Non lu</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">Aucun message pour le moment.</p>
          )}
        </section>
      </div>
    </>
  );
}

/* --- Réservations --------------------------------------------------------------------------- */

function ReservationDetails({ item, onSaveNote }) {
  const [note, setNote] = useState(item.note_interne || '');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await onSaveNote(item, note);
    setSaving(false);
  };
  return (
    <div className="details">
      <dl className="details__grid">
        <div>
          <dt>Pavillon souhaité</dt>
          <dd>{pavillonName(item.pavillon)}</dd>
        </div>
        <div>
          <dt>Pays / ville</dt>
          <dd>{[item.pays, item.ville].filter(Boolean).join(' — ') || '—'}</dd>
        </div>
        <div>
          <dt>Fonction</dt>
          <dd>{item.contact_fonction || '—'}</dd>
        </div>
        <div>
          <dt>Site web</dt>
          <dd>{item.site_web || '—'}</dd>
        </div>
        <div className="details__wide">
          <dt>Message</dt>
          <dd className="details__message">{item.message || '—'}</dd>
        </div>
      </dl>
      <label className="details__note">
        <span>Note interne (visible uniquement par l’équipe)</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Emplacement attribué, relances, paiement…" />
      </label>
      <button type="button" className="admin-button admin-button--dark" onClick={save} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Enregistrer la note'}
      </button>
    </div>
  );
}

function Reservations() {
  const request = useAdminApi();
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [pack, setPack] = useState('');
  const [open, setOpen] = useState(null);
  const q = useDebounced(search);
  const list = useAdminList('reservations', { q, statut, pack });

  const patch = async (item, body) => {
    const { item: updated } = await request(`/admin/reservations/${item.id}`, { method: 'PATCH', body });
    list.update((items) => items.map((row) => (row.id === updated.id ? updated : row)));
  };

  const remove = async (item) => {
    if (!window.confirm(`Supprimer définitivement la demande de « ${item.entreprise} » (${item.reference}) ?`)) return;
    await request(`/admin/reservations/${item.id}`, { method: 'DELETE' });
    list.update((items) => items.filter((row) => row.id !== item.id));
  };

  return (
    <>
      <PageHead title="Demandes de stand" subtitle={`${list.items.length} demande(s) affichée(s)`}>
        <ExportLink resource="reservations" qs={list.qs} />
      </PageHead>
      <div className="admin-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Entreprise, contact, e-mail, référence…" />
        <FilterSelect value={statut} onChange={setStatut} options={STATUTS} allLabel="Tous les statuts" ariaLabel="Filtrer par statut" />
        <FilterSelect
          value={pack}
          onChange={setPack}
          options={PACKS.map((item) => ({ value: item.id, label: `Pack ${item.name}` }))}
          allLabel="Tous les packs"
          ariaLabel="Filtrer par pack"
        />
      </div>
      <ListState loading={list.loading} error={list.error} count={list.items.length} empty="Aucune demande ne correspond à ces critères." />
      {list.items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Entreprise</th>
                <th>Contact</th>
                <th>Pack</th>
                <th>Statut</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <ReservationRow
                  key={item.id}
                  item={item}
                  open={open === item.id}
                  onToggle={() => setOpen(open === item.id ? null : item.id)}
                  onStatus={(value) => patch(item, { statut: value })}
                  onSaveNote={(row, note) => patch(row, { note_interne: note })}
                  onDelete={() => remove(item)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ReservationRow({ item, open, onToggle, onStatus, onSaveNote, onDelete }) {
  const pack = PACKS.find((p) => p.id === item.pack);
  return (
    <>
      <tr className={open ? 'is-open' : ''}>
        <td>
          <strong className="mono">{item.reference}</strong>
          <span className="muted">{formatDate(item.created_at)}</span>
        </td>
        <td>
          <strong>{item.entreprise}</strong>
          <span className="muted">{item.secteur || '—'}</span>
        </td>
        <td>
          {item.contact_nom}
          <a className="muted" href={`mailto:${item.email}`}>
            {item.email}
          </a>
          <a className="muted" href={`tel:${item.telephone.replace(/[^\d+]/g, '')}`}>
            {item.telephone}
          </a>
        </td>
        <td>
          <span className={`pack-pill pack-pill--${item.pack}`}>{pack?.name}</span>
          <span className="muted">{pack ? `${formatPrix(pack.prix)} HT` : ''}</span>
        </td>
        <td>
          <StatusBadge value={item.statut} />
          <select className="admin-select admin-select--small" value={item.statut} onChange={(event) => onStatus(event.target.value)} aria-label={`Changer le statut de ${item.entreprise}`}>
            {STATUTS.map((statut) => (
              <option key={statut.value} value={statut.value}>
                {statut.label}
              </option>
            ))}
          </select>
        </td>
        <td className="admin-table__actions">
          <button type="button" className="admin-link" onClick={onToggle} aria-expanded={open}>
            {open ? 'Masquer' : 'Détails'}
          </button>
          <button type="button" className="admin-icon-button" onClick={onDelete} aria-label={`Supprimer la demande de ${item.entreprise}`}>
            <Trash2 aria-hidden="true" />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="admin-table__details">
          <td colSpan={6}>
            <ReservationDetails item={item} onSaveNote={onSaveNote} />
          </td>
        </tr>
      )}
    </>
  );
}

/* --- Inscriptions ------------------------------------------------------------------------------- */

function Inscriptions() {
  const request = useAdminApi();
  const [search, setSearch] = useState('');
  const [jour, setJour] = useState('');
  const [profil, setProfil] = useState('');
  const q = useDebounced(search);
  const list = useAdminList('inscriptions', { q, jour, profil });

  const remove = async (item) => {
    if (!window.confirm(`Supprimer définitivement l’inscription de ${item.prenom} ${item.nom} (${item.reference}) ?`)) return;
    await request(`/admin/inscriptions/${item.id}`, { method: 'DELETE' });
    list.update((items) => items.filter((row) => row.id !== item.id));
  };

  return (
    <>
      <PageHead title="Inscriptions visiteurs" subtitle={`${list.items.length} inscription(s) affichée(s)`}>
        <ExportLink resource="inscriptions" qs={list.qs} />
      </PageHead>
      <div className="admin-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, e-mail, ville, référence…" />
        <FilterSelect value={jour} onChange={setJour} options={JOURS} allLabel="Tous les jours" ariaLabel="Filtrer par jour" />
        <FilterSelect value={profil} onChange={setProfil} options={PROFILS} allLabel="Tous les profils" ariaLabel="Filtrer par profil" />
      </div>
      <ListState loading={list.loading} error={list.error} count={list.items.length} empty="Aucune inscription ne correspond à ces critères." />
      {list.items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Visiteur</th>
                <th>Profil</th>
                <th>Jours</th>
                <th>Centres d’intérêt</th>
                <th>Newsletter</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="mono">{item.reference}</strong>
                    <span className="muted">{formatDate(item.created_at)}</span>
                  </td>
                  <td>
                    <strong>
                      {item.prenom} {item.nom}
                    </strong>
                    <a className="muted" href={`mailto:${item.email}`}>
                      {item.email}
                    </a>
                    {item.telephone && <span className="muted">{item.telephone}</span>}
                    {item.ville && <span className="muted">{item.ville}</span>}
                  </td>
                  <td>{label(PROFILS, item.profil)}</td>
                  <td>
                    {item.jours.map((value) => (
                      <span key={value} className="day-pill">
                        {label(JOURS, value).replace(/ juin$/, '')}
                      </span>
                    ))}
                  </td>
                  <td className="muted-cell">{item.interets.map((value) => label(INTERETS, value)).join(', ') || '—'}</td>
                  <td>{item.newsletter ? 'Oui' : 'Non'}</td>
                  <td className="admin-table__actions">
                    <button type="button" className="admin-icon-button" onClick={() => remove(item)} aria-label={`Supprimer l’inscription de ${item.prenom} ${item.nom}`}>
                      <Trash2 aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* --- Messages --------------------------------------------------------------------------------------- */

function Messages() {
  const request = useAdminApi();
  const [search, setSearch] = useState('');
  const [lu, setLu] = useState('');
  const [sujet, setSujet] = useState('');
  const q = useDebounced(search);
  const list = useAdminList('messages', { q, lu, sujet });

  const toggleRead = async (item) => {
    const { item: updated } = await request(`/admin/messages/${item.id}`, { method: 'PATCH', body: { lu: !item.lu } });
    list.update((items) => items.map((row) => (row.id === updated.id ? updated : row)));
  };

  const remove = async (item) => {
    if (!window.confirm(`Supprimer définitivement le message de ${item.nom} ?`)) return;
    await request(`/admin/messages/${item.id}`, { method: 'DELETE' });
    list.update((items) => items.filter((row) => row.id !== item.id));
  };

  return (
    <>
      <PageHead title="Messages" subtitle={`${list.items.filter((item) => !item.lu).length} non lu(s) sur ${list.items.length}`}>
        <ExportLink resource="messages" qs={list.qs} />
      </PageHead>
      <div className="admin-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, e-mail, contenu…" />
        <FilterSelect
          value={lu}
          onChange={setLu}
          options={[
            { value: 'false', label: 'Non lus' },
            { value: 'true', label: 'Lus' },
          ]}
          allLabel="Tous les messages"
          ariaLabel="Filtrer par état de lecture"
        />
        <FilterSelect value={sujet} onChange={setSujet} options={SUJETS} allLabel="Tous les sujets" ariaLabel="Filtrer par sujet" />
      </div>
      <ListState loading={list.loading} error={list.error} count={list.items.length} empty="Aucun message ne correspond à ces critères." />
      <ul className="messages">
        {list.items.map((item) => (
          <li key={item.id} className={`message ${item.lu ? '' : 'is-unread'}`}>
            <header className="message__head">
              <div>
                <strong>{item.nom}</strong>
                <span className="muted">
                  {label(SUJETS, item.sujet)} · {formatDate(item.created_at)}
                </span>
              </div>
              {!item.lu && <span className="status status--nouveau">Non lu</span>}
            </header>
            <p className="message__contact">
              <a href={`mailto:${item.email}`}>{item.email}</a>
              {item.telephone && <span> · {item.telephone}</span>}
            </p>
            <p className="message__body">{item.message}</p>
            <div className="message__actions">
              <a className="admin-button admin-button--dark" href={`mailto:${item.email}?subject=${encodeURIComponent(`ÉBËNA 2027 — ${label(SUJETS, item.sujet)}`)}`}>
                <Mail aria-hidden="true" /> Répondre
              </a>
              <button type="button" className="admin-button" onClick={() => toggleRead(item)}>
                <MailOpen aria-hidden="true" /> {item.lu ? 'Marquer non lu' : 'Marquer comme lu'}
              </button>
              <button type="button" className="admin-icon-button" onClick={() => remove(item)} aria-label={`Supprimer le message de ${item.nom}`}>
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* --- Newsletter -------------------------------------------------------------------------------------- */

function Newsletter() {
  const request = useAdminApi();
  const [search, setSearch] = useState('');
  const q = useDebounced(search);
  const list = useAdminList('newsletter', { q });

  const remove = async (item) => {
    if (!window.confirm(`Désinscrire ${item.email} de la newsletter ?`)) return;
    await request(`/admin/newsletter/${item.id}`, { method: 'DELETE' });
    list.update((items) => items.filter((row) => row.id !== item.id));
  };

  return (
    <>
      <PageHead title="Newsletter" subtitle={`${list.items.length} abonné(s) affiché(s)`}>
        <ExportLink resource="newsletter" qs={list.qs} />
      </PageHead>
      <div className="admin-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Adresse e-mail…" />
      </div>
      <ListState loading={list.loading} error={list.error} count={list.items.length} empty="Aucun abonné pour le moment." />
      {list.items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Origine</th>
                <th>Date</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </td>
                  <td>{item.source === 'inscription' ? 'Inscription visiteur' : 'Site'}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td className="admin-table__actions">
                    <button type="button" className="admin-icon-button" onClick={() => remove(item)} aria-label={`Désinscrire ${item.email}`}>
                      <Trash2 aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* --- Structure ------------------------------------------------------------------------------------------ */

const NAV = [
  { to: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard, end: true },
  { to: '/admin/reservations', label: 'Demandes de stand', icon: Store },
  { to: '/admin/inscriptions', label: 'Inscriptions', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
];

export default function AdminDashboard() {
  useDocumentMeta('Back-office');
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api('/admin/me', { signal: controller.signal })
      .then((data) => setAdmin(data.admin))
      .catch((err) => {
        if (err.name !== 'AbortError') navigate('/admin/login', { replace: true });
      });
    return () => controller.abort();
  }, [navigate]);

  const logout = async () => {
    await api('/admin/logout', { method: 'POST' }).catch(() => {});
    navigate('/admin/login', { replace: true });
  };

  const initials = useMemo(() => (admin?.nom || admin?.email || '?').slice(0, 1).toUpperCase(), [admin]);

  if (!admin) return <div className="admin-loading">Chargement du back-office…</div>;

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <img src="/images/logo-ebena-sm.webp" alt="ÉBËNA" width="480" height="134" />
          <span>Back-office</span>
        </Link>
        <nav className="admin-nav" aria-label="Back-office">
          {NAV.map(({ to, label: navLabel, icon: IconComponent, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav__link ${isActive ? 'is-active' : ''}`}>
              <IconComponent aria-hidden="true" /> {navLabel}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav__link">
            <ExternalLink aria-hidden="true" /> Voir le site
          </a>
          <div className="admin-user">
            <span className="admin-user__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="admin-user__email">{admin.email}</span>
          </div>
          <button type="button" className="admin-nav__link admin-logout" onClick={logout}>
            <LogOut aria-hidden="true" /> Se déconnecter
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="inscriptions" element={<Inscriptions />} />
          <Route path="messages" element={<Messages />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
